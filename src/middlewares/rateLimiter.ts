import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../redis/client';
import { config } from '../config';

export async function rateLimiter(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!redisClient.isOpen) {
    next();
    return;
  }

  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const key = `rate_limit:${clientIp}`;

  try {
    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, Math.ceil(config.rateLimit.windowMs / 1000));
    }

    res.setHeader('X-RateLimit-Limit', config.rateLimit.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.rateLimit.maxRequests - current));

    if (current > config.rateLimit.maxRequests) {
      res.status(429).json({
        status: 'error',
        message: 'Too many requests. Please try again later.'
      });
      return;
    }

    next();
  } catch (error) {
    next();
  }
}
