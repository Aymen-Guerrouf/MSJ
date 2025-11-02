import express from 'express';
import {
  getLearningResources,
  createLearningResource,
  updateLearningResource,
  deleteLearningResource,
} from '../controllers/learningResourceController.js';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validator.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Learning Resources
 *   description: Curated learning materials
 */

/**
 * @swagger
 * /api/learning-resources:
 *   get:
 *     summary: Get all learning resources
 *     tags: [Learning Resources]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: center
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of learning resources
 *   post:
 *     summary: Create learning resource (Admin only)
 *     tags: [Learning Resources]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *               - category
 *               - center
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               center:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resource created
 */

/**
 * @swagger
 * /api/learning-resources/{id}:
 *   put:
 *     summary: Update learning resource (Admin only)
 *     tags: [Learning Resources]
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
 *         description: Resource updated
 *   delete:
 *     summary: Delete learning resource (Admin only)
 *     tags: [Learning Resources]
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
 *         description: Resource deleted
 */

// Validation rules
const createResourceValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('Must be a valid URL'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('center').isMongoId().withMessage('Valid center ID is required'),
  validate,
];

const updateResourceValidation = [
  body('title').optional().trim().isLength({ max: 200 }),
  body('url').optional().trim().isURL().withMessage('Must be a valid URL'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('category').optional().trim(),
  validate,
];

const mongoIdValidation = [param('id').isMongoId().withMessage('Invalid ID format'), validate];

// Public route
router.get('/', getLearningResources);

// Admin-only routes
router.post('/', authenticate, isCenterAdmin, createResourceValidation, createLearningResource);
router.put(
  '/:id',
  authenticate,
  isCenterAdmin,
  mongoIdValidation,
  updateResourceValidation,
  updateLearningResource
);
router.delete('/:id', authenticate, isCenterAdmin, mongoIdValidation, deleteLearningResource);

export default router;
