import express from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import centerRoutes from './center.routes.js';
import eventRoutes from './event.routes.js';
import workshopRoutes from './workshop.routes.js';
import participationRoutes from './participation.routes.js';
import clubRoutes from './club.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/centers', centerRoutes);
router.use('/events', eventRoutes);
router.use('/workshops', workshopRoutes);
router.use('/participations', participationRoutes);
router.use('/clubs', clubRoutes);

export default router;
