import express from 'express';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as experienceSessionController from '../controllers/experienceSessionController.js';

const router = express.Router();

// Get all sessions (public with auth)
router.get('/', authenticate, experienceSessionController.listSessions);

// Get single session
router.get('/:id', authenticate, experienceSessionController.getSession);

// Create session (center admin only)
router.post('/', authenticate, isCenterAdmin, experienceSessionController.createSession);

export default router;
