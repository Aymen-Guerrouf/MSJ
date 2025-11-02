import express from 'express';
import {
  createStartupIdea,
  getAllStartupIdeas,
  getMyStartupIdeas,
  getStartupIdeaById,
  updateStartupIdea,
  deleteStartupIdea,
  addProgressSnap,
  getProgressSnaps,
  deleteProgressSnap,
  getPendingStartupIdeas,
  updateStartupIdeaStatus,
  toggleSupportBadge,
} from '../controllers/startupIdeaController.js';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validator.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Startup Space
 *   description: Startup ideas and entrepreneurship
 */

/**
 * @swagger
 * /api/startup-ideas:
 *   post:
 *     summary: Create a new startup idea
 *     tags: [Startup Space]
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
 *               - description
 *               - category
 *               - center
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *               category:
 *                 type: string
 *                 enum: [football, basketball, volleyball, chess, arts, music, theatre, coding, gaming, education, volunteering, culture, tech, health, entrepreneurship, design, marketing, other]
 *               center:
 *                 type: string
 *     responses:
 *       201:
 *         description: Startup idea created (status: pending)
 *   get:
 *     summary: Get all approved startup ideas
 *     tags: [Startup Space]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: center
 *         schema:
 *           type: string
 *       - in: query
 *         name: isSupported
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of approved startup ideas
 */

/**
 * @swagger
 * /api/startup-ideas/pending:
 *   get:
 *     summary: Get all pending startup ideas (Admin only)
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending ideas
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/startup-ideas/my:
 *   get:
 *     summary: Get my startup ideas
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's startup ideas
 */

/**
 * @swagger
 * /api/startup-ideas/{id}:
 *   get:
 *     summary: Get single startup idea
 *     tags: [Startup Space]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Startup idea details
 *   put:
 *     summary: Update startup idea (Owner only)
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Startup idea updated
 *   delete:
 *     summary: Delete startup idea
 *     tags: [Startup Space]
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
 *         description: Startup idea deleted
 */

/**
 * @swagger
 * /api/startup-ideas/{id}/status:
 *   put:
 *     summary: Approve or reject startup idea (Admin only)
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @swagger
 * /api/startup-ideas/{id}/support:
 *   put:
 *     summary: Toggle support badge (Admin only)
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isSupported
 *             properties:
 *               isSupported:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Support badge updated
 */

/**
 * @swagger
 * /api/startup-ideas/{id}/snaps:
 *   post:
 *     summary: Add progress snap to startup idea
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 1000
 *               imageUrl:
 *                 type: string
 *                 description: Optional pre-uploaded Cloudinary image URL
 *     responses:
 *       201:
 *         description: Progress snap added
 *   get:
 *     summary: Get all progress snaps for a startup idea
 *     tags: [Startup Space]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of progress snaps
 */

/**
 * @swagger
 * /api/startup-ideas/snaps/{snapId}:
 *   delete:
 *     summary: Delete progress snap
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: snapId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress snap deleted
 */

// Validation rules
const createStartupIdeaValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 }),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('center').isMongoId().withMessage('Valid center ID is required'),
  validate,
];

const updateStartupIdeaValidation = [
  body('title').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('category').optional().trim(),
  validate,
];

const addProgressSnapValidation = [
  body('text').trim().notEmpty().withMessage('Progress text is required').isLength({ max: 1000 }),
  body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
  validate,
];

const updateStatusValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  validate,
];

const toggleSupportValidation = [
  body('isSupported').isBoolean().withMessage('isSupported must be a boolean'),
  validate,
];

const mongoIdValidation = [param('id').isMongoId().withMessage('Invalid ID format'), validate];

// Admin routes (must come before dynamic routes)
router.get('/pending', authenticate, isCenterAdmin, getPendingStartupIdeas);
router.put(
  '/:id/status',
  authenticate,
  isCenterAdmin,
  mongoIdValidation,
  updateStatusValidation,
  updateStartupIdeaStatus
);
router.put(
  '/:id/support',
  authenticate,
  isCenterAdmin,
  mongoIdValidation,
  toggleSupportValidation,
  toggleSupportBadge
);

// Public and user routes
router.post('/', authenticate, createStartupIdeaValidation, createStartupIdea);
router.get('/', getAllStartupIdeas);
router.get('/my', authenticate, getMyStartupIdeas);
router.get('/:id', mongoIdValidation, getStartupIdeaById);
router.put('/:id', authenticate, mongoIdValidation, updateStartupIdeaValidation, updateStartupIdea);
router.delete('/:id', authenticate, mongoIdValidation, deleteStartupIdea);

// Progress Snap routes
router.post(
  '/:id/snaps',
  authenticate,
  mongoIdValidation,
  addProgressSnapValidation,
  addProgressSnap
);
router.get('/:id/snaps', mongoIdValidation, getProgressSnaps);
router.delete(
  '/snaps/:snapId',
  authenticate,
  param('snapId').isMongoId(),
  validate,
  deleteProgressSnap
);

export default router;
