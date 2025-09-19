import Redis from 'redis';
import logger from './logger';

let redis: Redis.RedisClientType;

export async function connectRedis() {
  try {
    redis = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redis.on('error', (err) => logger.error('Redis Client Error', err));
    redis.on('connect', () => logger.info('Connected to Redis'));

    await redis.connect();
    return redis;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export function getRedisClient() {
  if (!redis) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redis;
}

export async function getCachedData(key: string) {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Failed to get cached data for key ${key}:`, error);
    return null;
  }
}

export async function setCachedData(key: string, data: any, ttlSeconds = 3600) {
  try {
    const client = getRedisClient();
    await client.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    logger.error(`Failed to cache data for key ${key}:`, error);
  }
}

export async function deleteCachedData(key: string) {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    logger.error(`Failed to delete cached data for key ${key}:`, error);
  }
}