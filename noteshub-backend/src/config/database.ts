import { config } from './environment';

// Try to import Prisma, fall back to mock if not available
let PrismaClient: any;
let prisma: any;

try {
  const PrismaModule = require('@prisma/client');
  PrismaClient = PrismaModule.PrismaClient;
} catch (error) {
  console.warn('⚠️  Prisma client not available, using mock client for development');
  const { PrismaClient: MockPrismaClient } = require('../types/prisma-mock');
  PrismaClient = MockPrismaClient;
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: any | undefined;
}

if (config.app.env === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'minimal',
  });
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  }
  prisma = global.__prisma;
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Database initialization
export async function initializeDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}