import express from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);

export default router;
