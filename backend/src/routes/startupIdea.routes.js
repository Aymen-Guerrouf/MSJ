import express from 'express';
import {
  createStartupIdea,
  getAllStartupIdeas,
  getStartupIdeaById,
  updateMyProject,
  deleteMyProject,
  getMyProject,
  getAllSupervisors,
} from '../controllers/startupIdeaController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validator.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Startup Space
 *   description: Startup ideas and entrepreneurship supervision system
 */

/**
 * @swagger
 * /api/startup-ideas:
 *   get:
 *     summary: Get all public startup ideas (Sparks Hub)
 *     tags: [Startup Space]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Technology, Education, Healthcare, Environment, Innovation, AI, Mobile, Web, Social Impact, Business, Design, Science]
 *         description: Filter by project category
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *           enum: [idea, prototype, mvp, growth]
 *         description: Filter by project stage
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: List of public startup ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *   post:
 *     summary: Create a new startup idea (One project per user)
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
 *               - problemStatement
 *               - solution
 *               - targetMarket
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 example: AI-Powered Study Assistant
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: An intelligent platform to help students learn more effectively
 *               category:
 *                 type: string
 *                 enum: [Technology, Education, Healthcare, Environment, Innovation, AI, Mobile, Web, Social Impact, Business, Design, Science]
 *                 example: AI
 *               problemStatement:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Students struggle to organize their study materials
 *               solution:
 *                 type: string
 *                 maxLength: 1000
 *                 example: AI-powered platform that creates personalized study plans
 *               targetMarket:
 *                 type: string
 *                 maxLength: 500
 *                 example: University students aged 18-25
 *               stage:
 *                 type: string
 *                 enum: [idea, prototype, mvp, growth]
 *                 example: idea
 *     responses:
 *       201:
 *         description: Startup idea created successfully
 *       400:
 *         description: User already has a project or validation error
 */

/**
 * @swagger
 * /api/startup-ideas/{id}:
 *   get:
 *     summary: Get single startup idea by ID
 *     tags: [Startup Space]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Startup idea ID
 *     responses:
 *       200:
 *         description: Startup idea details (accessible if public OR owner OR supervisor)
 *       403:
 *         description: Not authorized to view this project
 *       404:
 *         description: Startup idea not found
 */

/**
 * @swagger
 * /api/startup-ideas/my-project:
 *   get:
 *     summary: Get my startup project
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's startup project
 *       404:
 *         description: No project found
 *   put:
 *     summary: Update my startup project
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *               category:
 *                 type: string
 *               problemStatement:
 *                 type: string
 *                 maxLength: 1000
 *               solution:
 *                 type: string
 *                 maxLength: 1000
 *               targetMarket:
 *                 type: string
 *                 maxLength: 500
 *               stage:
 *                 type: string
 *                 enum: [idea, prototype, mvp, growth]
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: No project found
 *   delete:
 *     summary: Delete my startup project
 *     tags: [Startup Space]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: No project found
 */

/**
 * @swagger
 * /api/users/supervisors:
 *   get:
 *     summary: Get all available supervisors
 *     tags: [Startup Space]
 *     parameters:
 *       - in: query
 *         name: expertise
 *         schema:
 *           type: string
 *         description: Filter by supervisor expertise area
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, title, or bio
 *     responses:
 *       200:
 *         description: List of available supervisors
 */

// Validation rules
const createStartupIdeaValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 }),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Technology',
      'Education',
      'Healthcare',
      'Environment',
      'Innovation',
      'AI',
      'Mobile',
      'Web',
      'Social Impact',
      'Business',
      'Design',
      'Science',
    ]),
  body('problemStatement')
    .trim()
    .notEmpty()
    .withMessage('Problem statement is required')
    .isLength({ max: 1000 }),
  body('solution').trim().notEmpty().withMessage('Solution is required').isLength({ max: 1000 }),
  body('targetMarket')
    .trim()
    .notEmpty()
    .withMessage('Target market is required')
    .isLength({ max: 500 }),
  body('stage')
    .optional()
    .isIn(['idea', 'prototype', 'mvp', 'growth'])
    .withMessage('Invalid stage'),
  validate,
];

const updateStartupIdeaValidation = [
  body('title').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('category')
    .optional()
    .trim()
    .isIn([
      'Technology',
      'Education',
      'Healthcare',
      'Environment',
      'Innovation',
      'AI',
      'Mobile',
      'Web',
      'Social Impact',
      'Business',
      'Design',
      'Science',
    ]),
  body('problemStatement').optional().trim().isLength({ max: 1000 }),
  body('solution').optional().trim().isLength({ max: 1000 }),
  body('targetMarket').optional().trim().isLength({ max: 500 }),
  body('stage').optional().isIn(['idea', 'prototype', 'mvp', 'growth']),
  validate,
];

const mongoIdValidation = [param('id').isMongoId().withMessage('Invalid ID format'), validate];

// Routes
router.get('/supervisors', getAllSupervisors);
router.get('/my-project', authenticate, getMyProject);
router.put('/my-project', authenticate, updateStartupIdeaValidation, updateMyProject);
router.delete('/my-project', authenticate, deleteMyProject);

router.post('/', authenticate, createStartupIdeaValidation, createStartupIdea);
router.get('/', getAllStartupIdeas);
router.get('/:id', mongoIdValidation, getStartupIdeaById);

export default router;
