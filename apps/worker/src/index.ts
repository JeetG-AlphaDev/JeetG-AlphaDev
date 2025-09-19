import dotenv from 'dotenv';
import { createClient } from 'redis';
import Queue from 'bull';

// Load environment variables
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Initialize Redis connection
const redis = createClient({
  url: REDIS_URL,
});

// Connect to Redis (optional, since Bull will handle its own connections)
redis.on('error', (err) => {
  console.log('Redis Client Error', err);
});

// Initialize job queues
const emailQueue = new Queue('email processing', REDIS_URL);
const notificationQueue = new Queue('notification processing', REDIS_URL);

// Email job processor
emailQueue.process('send-email', async (job) => {
  const { to, subject, content, type } = job.data;
  
  console.log(`📧 Processing email job: ${job.id}`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Type: ${type}`);
  
  // TODO: Implement actual email sending logic
  // For now, just simulate processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`✅ Email job ${job.id} completed`);
  return { status: 'sent', jobId: job.id };
});

// Notification job processor
notificationQueue.process('send-notification', async (job) => {
  const { userId, title, message, type } = job.data;
  
  console.log(`🔔 Processing notification job: ${job.id}`);
  console.log(`   User ID: ${userId}`);
  console.log(`   Title: ${title}`);
  console.log(`   Type: ${type}`);
  
  // TODO: Implement actual notification logic
  // For now, just simulate processing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`✅ Notification job ${job.id} completed`);
  return { status: 'sent', jobId: job.id };
});

// Queue event handlers
emailQueue.on('completed', (job, result) => {
  console.log(`📧 Email job ${job.id} completed:`, result);
});

emailQueue.on('failed', (job, err) => {
  console.error(`❌ Email job ${job.id} failed:`, err.message);
});

notificationQueue.on('completed', (job, result) => {
  console.log(`🔔 Notification job ${job.id} completed:`, result);
});

notificationQueue.on('failed', (job, err) => {
  console.error(`❌ Notification job ${job.id} failed:`, err.message);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Worker shutting down...');
  await emailQueue.close();
  await notificationQueue.close();
  await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Worker shutting down...');
  await emailQueue.close();
  await notificationQueue.close();
  await redis.quit();
  process.exit(0);
});

console.log('🚀 NotesHub Worker started');
console.log('📧 Email queue ready');
console.log('🔔 Notification queue ready');
console.log(`🔗 Redis connected: ${REDIS_URL}`);