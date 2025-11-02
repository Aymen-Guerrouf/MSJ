import express from 'express';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as experienceSessionController from '../controllers/experienceSessionController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Experience Sharing
 *   description: Experience sessions and cards
 */

/**
 * @swagger
 * /api/experience-sessions:
 *   get:
 *     summary: Get all experience sessions
 *     tags: [Experience Sharing]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of experience sessions
 *   post:
 *     summary: Create experience session (Admin only)
 *     tags: [Experience Sharing]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Session created
 */

/**
 * @swagger
 * /api/experience-sessions/{id}:
 *   get:
 *     summary: Get single experience session
 *     tags: [Experience Sharing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session details
 */

// Get all sessions (public with auth)
router.get('/', authenticate, experienceSessionController.listSessions);

// Get single session
router.get('/:id', authenticate, experienceSessionController.getSession);

// Create session (center admin only)
router.post('/', authenticate, isCenterAdmin, experienceSessionController.createSession);

export default router;
