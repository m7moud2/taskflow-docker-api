import { Request, Response } from 'express';
import { checkDatabaseHealth } from '../db/client';
import { checkRedisHealth } from '../redis/client';

export async function getHealthStatus(req: Request, res: Response): Promise<void> {
  const dbHealthy = await checkDatabaseHealth();
  const redisHealthy = await checkRedisHealth();

  const isHealthy = dbHealthy && redisHealthy;

  const healthData = {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbHealthy ? 'up' : 'down',
      redis: redisHealthy ? 'up' : 'down'
    },
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
    }
  };

  res.status(isHealthy ? 200 : 503).json(healthData);
}
