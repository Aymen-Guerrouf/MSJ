import express from 'express';
import {
  createMentorshipRequest,
  getMyMentorshipRequests,
  updateMentorshipRequestStatus,
  deleteMentorshipRequest,
} from '../controllers/mentorshipController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validator.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mentorship
 *   description: Mentor-mentee connections
 */

/**
 * @swagger
 * /api/mentors/connect:
 *   post:
 *     summary: Request mentorship from a mentor
 *     tags: [Mentorship]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mentorId
 *               - message
 *             properties:
 *               mentorId:
 *                 type: string
 *               message:
 *                 type: string
 *               startupIdeaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mentorship request sent
 */

/**
 * @swagger
 * /api/mentors/requests/my:
 *   get:
 *     summary: Get my mentorship requests
 *     tags: [Mentorship]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *     responses:
 *       200:
 *         description: Sent and received mentorship requests
 */

/**
 * @swagger
 * /api/mentors/requests/{id}:
 *   put:
 *     summary: Accept or reject mentorship request (Mentor only)
 *     tags: [Mentorship]
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
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Request status updated
 *   delete:
 *     summary: Cancel mentorship request
 *     tags: [Mentorship]
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
 *         description: Request deleted
 */

// Validation rules
const createMentorshipRequestValidation = [
  body('mentorId').isMongoId().withMessage('Valid mentor ID is required'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 1000 }),
  body('startupIdeaId').optional().isMongoId().withMessage('Invalid startup idea ID'),
  validate,
];

const updateStatusValidation = [
  body('status').isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected'),
  validate,
];

const mongoIdValidation = [param('id').isMongoId().withMessage('Invalid ID format'), validate];

// Mentorship request routes
router.post('/connect', authenticate, createMentorshipRequestValidation, createMentorshipRequest);
router.get('/requests/my', authenticate, getMyMentorshipRequests);
router.put(
  '/requests/:id',
  authenticate,
  mongoIdValidation,
  updateStatusValidation,
  updateMentorshipRequestStatus
);
router.delete('/requests/:id', authenticate, mongoIdValidation, deleteMentorshipRequest);

export default router;
