import { Router } from 'express';
import { AuthenticatedRequest, adminMiddleware } from '../middleware/auth';
import { LLMService } from '../services/llm.service';
import { AppError } from '../middleware/error';
import { prisma } from '../db/client';

const router = Router();

// All admin routes require admin role
router.use(adminMiddleware);

// Get dashboard stats
router.get('/stats',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const [
        totalUsers,
        totalNotes,
        totalAIQueries,
        totalReports,
        recentUsers,
        recentNotes,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.note.count(),
        prisma.aIQuery.count(),
        prisma.report.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
        prisma.note.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
      ]);

      // Get AI query stats
      const llmService = new LLMService();
      const aiStats = await llmService.getQueryStats(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      );

      res.json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            recent: recentUsers,
          },
          notes: {
            total: totalNotes,
            recent: recentNotes,
          },
          aiQueries: {
            total: totalAIQueries,
            ...aiStats,
          },
          reports: {
            total: totalReports,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all users with pagination
router.get('/users',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isPremium: true,
            emailVerified: true,
            createdAt: true,
            _count: {
              select: {
                notes: true,
                aiQueries: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.user.count(),
      ]);

      res.json({
        success: true,
        data: {
          users,
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

// Update user role or premium status
router.put('/users/:id',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { role, isPremium } = req.body;

      const updateData: any = {};
      if (role) updateData.role = role;
      if (typeof isPremium === 'boolean') updateData.isPremium = isPremium;

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isPremium: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all notes with pagination and filters
router.get('/notes',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (req.query.visibility) {
        whereClause.visibility = req.query.visibility;
      }

      const [notes, total] = await Promise.all([
        prisma.note.findMany({
          where: whereClause,
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            _count: {
              select: {
                reports: true,
                aiQueries: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.note.count({ where: whereClause }),
      ]);

      res.json({
        success: true,
        data: {
          notes,
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

// Delete note (admin override)
router.delete('/notes/:id',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      
      const note = await prisma.note.findUnique({
        where: { id },
      });

      if (!note) {
        throw new AppError('Note not found', 404);
      }

      await prisma.note.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Note deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get reports with pagination
router.get('/reports',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (req.query.status) {
        whereClause.status = req.query.status;
      }

      const [reports, total] = await Promise.all([
        prisma.report.findMany({
          where: whereClause,
          include: {
            note: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            reporter: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.report.count({ where: whereClause }),
      ]);

      res.json({
        success: true,
        data: {
          reports,
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

// Resolve report
router.put('/reports/:id',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { status, resolution } = req.body;

      const report = await prisma.report.update({
        where: { id },
        data: {
          status,
          resolution,
          resolvedBy: req.user!.id,
          resolvedAt: new Date(),
        },
        include: {
          note: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          reporter: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get ad slots
router.get('/ads',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const adSlots = await prisma.adSlot.findMany({
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: adSlots,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create or update ad slot
router.post('/ads',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { name, page, position, code, enabled } = req.body;

      const adSlot = await prisma.adSlot.upsert({
        where: { name },
        update: { page, position, code, enabled },
        create: { name, page, position, code, enabled },
      });

      res.json({
        success: true,
        data: adSlot,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;