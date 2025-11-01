import express from 'express';
import { getConnectionStatus } from '../config/database.config.js';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/', (req, res) => {
  const dbStatus = getConnectionStatus();

  res.json({
    success: true,
    message: 'Service is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

export default router;
