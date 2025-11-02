import express from 'express';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as experienceCardController from '../controllers/experienceCardController.js';

const router = express.Router();

// Get all cards (public with auth)
router.get('/', authenticate, experienceCardController.listCards);

// Get single card
router.get('/:id', authenticate, experienceCardController.getCard);

// Create card (center admin only)
router.post('/', authenticate, isCenterAdmin, experienceCardController.createCard);

export default router;
