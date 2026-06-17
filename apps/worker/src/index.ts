import Redis from 'redis';
import cron from 'node-cron';
import logger from './utils/logger';
import { FileProcessor } from './processors/FileProcessor';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

const fileProcessor = new FileProcessor();

async function main() {
  try {
    // Connect to Redis
    await redis.connect();
    logger.info('Connected to Redis');

    // Start processing queue
    startQueueProcessor();

    // Start cleanup job (runs every hour)
    cron.schedule('0 * * * *', cleanupExpiredSessions);
    
    logger.info('🔄 Worker started successfully');
  } catch (error) {
    logger.error('Failed to start worker:', error);
    process.exit(1);
  }
}

async function startQueueProcessor() {
  logger.info('Starting queue processor...');

  while (true) {
    try {
      // Check for pending upload sessions to process
      const pendingSessions = await prisma.uploadSession.findMany({
        where: {
          processed: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        take: 10, // Process 10 at a time
      });

      for (const session of pendingSessions) {
        try {
          await processUploadSession(session);
        } catch (error) {
          logger.error(`Failed to process session ${session.id}:`, error);
        }
      }

      // Wait 30 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
      logger.error('Queue processor error:', error);
      await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute on error
    }
  }
}

async function processUploadSession(session: any) {
  logger.info(`Processing upload session: ${session.id}`);

  try {
    // Check if the file exists and note is created
    if (!session.noteId) {
      logger.warn(`Session ${session.id} has no associated note, skipping`);
      return;
    }

    const note = await prisma.note.findUnique({
      where: { id: session.noteId },
    });

    if (!note) {
      logger.warn(`Note ${session.noteId} not found for session ${session.id}`);
      return;
    }

    // Extract file key from URL
    const fileKey = session.uploadUrl.split('?')[0].split('/').pop();
    if (!fileKey) {
      throw new Error('Could not extract file key from upload URL');
    }

    // Process the file based on its type
    const result = await fileProcessor.processFile(fileKey, session.mimeType, session.filename);

    // Update note with processed content
    await prisma.note.update({
      where: { id: session.noteId },
      data: {
        contentText: result.text,
        contentHtml: result.html,
        thumbnailUrl: result.thumbnailUrl,
      },
    });

    // Mark session as processed
    await prisma.uploadSession.update({
      where: { id: session.id },
      data: { processed: true },
    });

    logger.info(`Successfully processed session: ${session.id}`);
  } catch (error) {
    logger.error(`Error processing session ${session.id}:`, error);
    
    // Mark session as failed (you might want to add a 'failed' status)
    await prisma.uploadSession.update({
      where: { id: session.id },
      data: { processed: true }, // Mark as processed to avoid reprocessing
    });
  }
}

async function cleanupExpiredSessions() {
  logger.info('Running cleanup job for expired sessions');

  try {
    const expiredSessions = await prisma.uploadSession.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        processed: false,
      },
    });

    logger.info(`Found ${expiredSessions.length} expired sessions to clean up`);

    for (const session of expiredSessions) {
      try {
        // Delete the file from storage if it exists
        // Note: In a real implementation, you'd want to check if the file is still needed
        // before deleting it
        
        // Mark session as processed (expired)
        await prisma.uploadSession.update({
          where: { id: session.id },
          data: { processed: true },
        });

        logger.info(`Cleaned up expired session: ${session.id}`);
      } catch (error) {
        logger.error(`Failed to cleanup session ${session.id}:`, error);
      }
    }
  } catch (error) {
    logger.error('Cleanup job error:', error);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await redis.quit();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await redis.quit();
  await prisma.$disconnect();
  process.exit(0);
});

main();