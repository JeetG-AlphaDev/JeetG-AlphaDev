import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { LLMService } from '../services/llm.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { prisma } from '../db/client';
import rateLimit from 'express-rate-limit';

const router = Router();

// AI-specific rate limiting (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 AI requests per minute
  message: {
    error: 'Too many AI requests. Please wait before asking another question.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

// Query AI
router.post('/query',
  aiLimiter,
  [
    body('question').trim().isLength({ min: 5, max: 1000 }).withMessage('Question must be between 5 and 1000 characters'),
    body('noteId').optional().isString().withMessage('Note ID must be a string'),
    body('context').optional().isString().isLength({ max: 5000 }).withMessage('Context too long (max 5000 characters)'),
    body('stream').optional().isBoolean().withMessage('Stream must be a boolean'),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { question, noteId, context, stream = false } = req.body;
      const userId = req.user!.id;

      const llmService = new LLMService();
      
      if (stream) {
        // Set up streaming response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // For now, we'll handle streaming by still getting the full response
        // In a production app, you'd want true streaming here
        const result = await llmService.queryLLM({
          prompt: question,
          context,
          userId,
          noteId,
          stream: false, // We'll simulate streaming by chunking the response
        });

        // Simulate streaming by sending the response in chunks
        const chunks = result.response.split(' ');
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i] + (i < chunks.length - 1 ? ' ' : '');
          res.write(`data: ${JSON.stringify({ 
            type: 'chunk', 
            content: chunk,
            isLast: i === chunks.length - 1 
          })}\n\n`);
          
          // Small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        res.write(`data: ${JSON.stringify({ 
          type: 'complete', 
          metadata: {
            tokensUsed: result.tokensUsed,
            cached: result.cached,
            id: result.id
          }
        })}\n\n`);
        
        res.end();
      } else {
        // Regular response
        const result = await llmService.queryLLM({
          prompt: question,
          context,
          userId,
          noteId,
        });

        res.json({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      if (stream) {
        res.write(`data: ${JSON.stringify({ 
          type: 'error', 
          error: (error as Error).message 
        })}\n\n`);
        res.end();
      } else {
        next(error);
      }
    }
  }
);

// Get user's AI query history
router.get('/history',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      const queries = await prisma.aIQuery.findMany({
        where: { userId },
        include: {
          note: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.aIQuery.count({
        where: { userId },
      });

      res.json({
        success: true,
        data: {
          queries,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user's daily query usage
router.get('/usage',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [todayCount, monthCount, totalTokens] = await Promise.all([
        prisma.aIQuery.count({
          where: {
            userId,
            createdAt: { gte: today },
          },
        }),
        prisma.aIQuery.count({
          where: {
            userId,
            createdAt: { 
              gte: new Date(today.getFullYear(), today.getMonth(), 1),
            },
          },
        }),
        prisma.aIQuery.aggregate({
          where: { userId },
          _sum: { tokensUsed: true },
        }),
      ]);

      const user = req.user!;
      const dailyLimit = user.isPremium ? 1000 : 10;

      res.json({
        success: true,
        data: {
          today: todayCount,
          month: monthCount,
          totalTokens: totalTokens._sum.tokensUsed || 0,
          dailyLimit,
          remaining: Math.max(0, dailyLimit - todayCount),
          isPremium: user.isPremium,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;