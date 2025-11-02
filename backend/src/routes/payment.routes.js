import { createCheckout } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.post('/checkout', authenticate, createCheckout);

export default router;
