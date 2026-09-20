import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import { rateLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1', rateLimiter, routes);

  app.use(errorHandler);

  return app;
}
