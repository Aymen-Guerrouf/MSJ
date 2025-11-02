import express from 'express';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as experienceCardController from '../controllers/experienceCardController.js';

const router = express.Router();

/**
 * @swagger
 * /api/experience-cards:
 *   get:
 *     summary: Get all experience cards
 *     tags: [Experience Sharing]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of experience cards
 *   post:
 *     summary: Create experience card (Admin only)
 *     tags: [Experience Sharing]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Card created
 */

/**
 * @swagger
 * /api/experience-cards/{id}:
 *   get:
 *     summary: Get single experience card
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
 *         description: Card details
 */

// Get all cards (public with auth)
router.get('/', authenticate, experienceCardController.listCards);

// Get single card
router.get('/:id', authenticate, experienceCardController.getCard);

// Create card (center admin only)
router.post('/', authenticate, isCenterAdmin, experienceCardController.createCard);

export default router;
