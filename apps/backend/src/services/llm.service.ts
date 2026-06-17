import { getCachedData, setCachedData } from '../utils/redis';
import logger from '../utils/logger';
import { prisma } from '../db/client';
import { AppError } from '../middleware/error';

export interface LLMConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  streamingSupported: boolean;
}

export interface LLMRequest {
  prompt: string;
  context?: string;
  userId: string;
  noteId?: string;
  stream?: boolean;
  maxTokens?: number;
}

export interface LLMResponse {
  response: string;
  tokensUsed?: number;
  cached: boolean;
  id: string;
}

export class LLMService {
  private config: LLMConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.LLM_API_BASE_URL || '',
      apiKey: process.env.LLM_API_KEY || '',
      model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
      streamingSupported: process.env.STREAMING_SUPPORTED === 'true',
    };

    if (!this.config.baseUrl || !this.config.apiKey) {
      logger.warn('LLM API configuration incomplete. AI features will be limited.');
    }
  }

  async queryLLM(request: LLMRequest): Promise<LLMResponse> {
    const { prompt, context, userId, noteId, stream = false, maxTokens = 1000 } = request;

    // Check rate limits for user
    await this.checkRateLimit(userId);

    // Generate cache key
    const cacheKey = this.generateCacheKey(prompt, context);
    
    // Try to get cached response
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) {
      logger.info(`Cache hit for LLM query: ${cacheKey}`);
      
      // Log the query (cached)
      await this.logQuery(userId, noteId, prompt, cachedResponse.response, context, 0, true);
      
      return {
        ...cachedResponse,
        cached: true,
      };
    }

    // Prepare the full prompt with system instructions
    const systemPrompt = this.getSystemPrompt();
    const fullPrompt = this.buildFullPrompt(systemPrompt, context, prompt);

    try {
      // Make API call
      const response = await this.callLLMAPI(fullPrompt, maxTokens, stream);
      
      // Cache the response (24 hours)
      await setCachedData(cacheKey, {
        response: response.response,
        tokensUsed: response.tokensUsed,
        id: response.id,
      }, 86400);

      // Log the query
      await this.logQuery(userId, noteId, prompt, response.response, context, response.tokensUsed, false);

      return {
        ...response,
        cached: false,
      };
    } catch (error) {
      logger.error('LLM API error:', error);
      
      // Log failed query
      await this.logQuery(userId, noteId, prompt, null, context, 0, false, (error as Error).message);
      
      throw new AppError('AI service is temporarily unavailable', 503);
    }
  }

  private async callLLMAPI(prompt: string, maxTokens: number, stream: boolean): Promise<LLMResponse> {
    const requestBody = {
      model: this.config.model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      stream,
    };

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
    }

    if (stream && this.config.streamingSupported) {
      // Handle streaming response
      return this.handleStreamingResponse(response);
    } else {
      // Handle regular response
      const data = await response.json();
      return {
        response: data.choices[0]?.message?.content || 'No response generated',
        tokensUsed: data.usage?.total_tokens || 0,
        id: data.id || `llm-${Date.now()}`,
      };
    }
  }

  private async handleStreamingResponse(response: Response): Promise<LLMResponse> {
    // For streaming, we'll accumulate the response
    // In a real implementation, you'd want to stream this back to the client
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let tokensUsed = 0;
    let responseId = `llm-${Date.now()}`;

    if (!reader) {
      throw new Error('No response stream available');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                fullResponse += parsed.choices[0].delta.content;
              }
              if (parsed.id) {
                responseId = parsed.id;
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return {
      response: fullResponse || 'No response generated',
      tokensUsed,
      id: responseId,
    };
  }

  private getSystemPrompt(): string {
    return `You are an intelligent tutor assistant integrated into NotesHub, a platform for sharing and reading academic notes. Your role is to help students understand the content they're reading by answering questions and providing explanations.

Guidelines:
1. Always base your answers on the provided note context when available
2. Cite specific sections or line numbers from the notes when referencing information
3. If the question cannot be answered from the context, clearly state this and offer general guidance
4. Keep responses concise but comprehensive
5. Use an encouraging, educational tone
6. Suggest follow-up questions or related topics when appropriate
7. If asked about topics not covered in the notes, acknowledge this and provide brief general information

Remember: You're helping students learn and understand their study materials better.`;
  }

  private buildFullPrompt(systemPrompt: string, context?: string, userQuestion?: string): string {
    let prompt = systemPrompt + '\n\n';

    if (context) {
      prompt += `CONTEXT FROM NOTE:\n${context}\n\n`;
    }

    if (userQuestion) {
      prompt += `STUDENT QUESTION: ${userQuestion}\n\n`;
    }

    prompt += 'Please provide a helpful response:';

    return prompt;
  }

  private generateCacheKey(prompt: string, context?: string): string {
    const content = `${prompt}|${context || ''}`;
    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `llm:${Math.abs(hash)}`;
  }

  private async checkRateLimit(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check daily query count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queryCount = await prisma.aIQuery.count({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
    });

    const limit = user.isPremium ? 1000 : 10; // Premium: 1000/day, Free: 10/day
    
    if (queryCount >= limit) {
      throw new AppError(
        user.isPremium 
          ? 'Daily query limit reached. Please try again tomorrow.'
          : 'Daily free query limit reached. Upgrade to premium for unlimited queries.',
        429
      );
    }
  }

  private async logQuery(
    userId: string,
    noteId: string | undefined,
    question: string,
    response: string | null,
    context: string | undefined,
    tokensUsed: number,
    cached: boolean,
    error?: string
  ): Promise<void> {
    try {
      await prisma.aIQuery.create({
        data: {
          userId,
          noteId,
          question,
          response,
          context,
          tokensUsed,
          cached,
          error,
        },
      });
    } catch (err) {
      logger.error('Failed to log AI query:', err);
    }
  }

  // Method to get query statistics for admin
  async getQueryStats(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const [totalQueries, cachedQueries, failedQueries, totalTokens] = await Promise.all([
      prisma.aIQuery.count({ where: whereClause }),
      prisma.aIQuery.count({ where: { ...whereClause, cached: true } }),
      prisma.aIQuery.count({ where: { ...whereClause, error: { not: null } } }),
      prisma.aIQuery.aggregate({
        where: whereClause,
        _sum: { tokensUsed: true },
      }),
    ]);

    return {
      totalQueries,
      cachedQueries,
      failedQueries,
      totalTokens: totalTokens._sum.tokensUsed || 0,
      cacheHitRate: totalQueries > 0 ? (cachedQueries / totalQueries) * 100 : 0,
      errorRate: totalQueries > 0 ? (failedQueries / totalQueries) * 100 : 0,
    };
  }
}