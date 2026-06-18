import { Request, Response } from 'express';
import { prisma, checkDatabaseConnection } from '../config/database';
import { config } from '../config/environment';
import { HealthCheckResult, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/error';

const startTime = Date.now();

export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  // Check database connection
  const dbStart = Date.now();
  const isDatabaseHealthy = await checkDatabaseConnection();
  const dbResponseTime = Date.now() - dbStart;

  const healthResult: HealthCheckResult = {
    status: isDatabaseHealthy ? 'healthy' : 'unhealthy',
    version: '1.0.0',
    timestamp,
    uptime,
    checks: {
      database: {
        status: isDatabaseHealthy ? 'up' : 'down',
        responseTime: dbResponseTime,
      },
    },
  };

  // Add Redis check if configured
  if (config.redis.url) {
    // In a real implementation, you would check Redis connection here
    healthResult.checks.redis = {
      status: 'up', // Placeholder
      responseTime: 0,
    };
  }

  // Add S3 check if configured
  if (config.aws.s3Bucket) {
    // In a real implementation, you would check S3 connection here
    healthResult.checks.s3 = {
      status: 'up', // Placeholder
      responseTime: 0,
    };
  }

  const statusCode = healthResult.status === 'healthy' ? 200 : 503;
  
  const response: ApiResponse<HealthCheckResult> = {
    success: healthResult.status === 'healthy',
    data: healthResult,
  };

  res.status(statusCode).json(response);
});

export const readinessCheck = asyncHandler(async (req: Request, res: Response) => {
  // Check if the application is ready to accept requests
  const isDatabaseReady = await checkDatabaseConnection();
  
  if (!isDatabaseReady) {
    res.status(503).json({
      success: false,
      error: 'Service not ready - database unavailable',
    });
    return;
  }

  res.json({
    success: true,
    message: 'Service is ready',
  });
});

export const livenessCheck = asyncHandler(async (req: Request, res: Response) => {
  // Simple liveness check - just return OK if the process is running
  res.json({
    success: true,
    message: 'Service is alive',
    uptime: Math.floor((Date.now() - startTime) / 1000),
  });
});