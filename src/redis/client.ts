import { createClient } from 'redis';
import { config } from '../config';

export const redisClient = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function checkRedisHealth(): Promise<boolean> {
  try {
    if (!redisClient.isOpen) return false;
    const response = await redisClient.ping();
    return response === 'PONG';
  } catch (error) {
    return false;
  }
}
