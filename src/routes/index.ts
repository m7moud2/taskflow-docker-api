import { Router } from 'express';
import healthRoutes from './health.routes';
import taskRoutes from './tasks.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/', taskRoutes);

export default router;
