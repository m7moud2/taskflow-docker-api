import { createApp } from './app';
import { config } from './config';
import { pool, initDatabase } from './db/client';
import { connectRedis, redisClient } from './redis/client';

async function bootstrap() {
  try {
    await initDatabase();
    console.log('[Database] Connected and schema initialized.');
  } catch (error) {
    console.warn('[Database] Connection warning:', (error as Error).message);
  }

  try {
    await connectRedis();
    console.log('[Redis] Connected successfully.');
  } catch (error) {
    console.warn('[Redis] Connection warning:', (error as Error).message);
  }

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`[Server] TaskFlow API listening on port ${config.port} (${config.env})`);
  });

  const shutdown = async (signal: string) => {
    console.log(`[Server] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await pool.end();
        console.log('[Database] Pool disconnected.');
        if (redisClient.isOpen) {
          await redisClient.disconnect();
          console.log('[Redis] Client disconnected.');
        }
        process.exit(0);
      } catch (err) {
        console.error('[Server] Error during shutdown:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
