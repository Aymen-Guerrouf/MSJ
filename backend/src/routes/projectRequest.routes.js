import express from 'express';
import {
  createProjectRequest,
  getMyRequests,
  respondToRequest,
  cancelRequest,
} from '../controllers/projectRequestController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validator.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Project Requests
 *   description: Supervision request management for startup projects
 */

/**
 * @swagger
 * /api/project-requests:
 *   post:
 *     summary: Send supervision request to a supervisor
 *     tags: [Project Requests]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supervisorId
 *             properties:
 *               supervisorId:
 *                 type: string
 *                 description: MongoDB ObjectId of the supervisor
 *                 example: 507f1f77bcf86cd799439011
 *               message:
 *                 type: string
 *                 maxLength: 500
 *                 description: Optional message to the supervisor
 *                 example: I would love your guidance on this AI project
 *     responses:
 *       201:
 *         description: Request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Project request sent successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or duplicate request
 *       404:
 *         description: Project or supervisor not found
 */

/**
 * @swagger
 * /api/project-requests/my-requests:
 *   get:
 *     summary: Get entrepreneur's sent requests
 *     tags: [Project Requests]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent requests
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
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [pending, approved, rejected]
 *                       supervisor:
 *                         type: object
 *                       startupIdea:
 *                         type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/project-requests/{id}/respond:
 *   put:
 *     summary: Supervisor responds to a request via email link (approve/reject)
 *     tags: [Project Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project request ID
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
 *                 example: approved
 *               responseMessage:
 *                 type: string
 *                 maxLength: 500
 *                 example: Great project! I'd love to supervise this.
 *     responses:
 *       200:
 *         description: Request responded successfully
 *       400:
 *         description: Invalid status or already responded
 *       403:
 *         description: Not authorized to respond to this request
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /api/project-requests/{id}:
 *   delete:
 *     summary: Cancel a pending request
 *     tags: [Project Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project request ID
 *     responses:
 *       200:
 *         description: Request cancelled successfully
 *       400:
 *         description: Can only cancel pending requests
 *       403:
 *         description: Not authorized to cancel this request
 *       404:
 *         description: Request not found
 */

// Validation rules
const createRequestValidation = [
  body('supervisorId')
    .notEmpty()
    .withMessage('Supervisor ID is required')
    .isMongoId()
    .withMessage('Invalid supervisor ID'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message must not exceed 500 characters'),
  validate,
];

const respondValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either approved or rejected'),
  body('responseMessage')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Response message must not exceed 500 characters'),
  validate,
];

const mongoIdValidation = [param('id').isMongoId().withMessage('Invalid ID format'), validate];

// Routes
router.post('/', authenticate, createRequestValidation, createProjectRequest);
router.get('/my-requests', authenticate, getMyRequests);
router.put('/:id/respond', authenticate, mongoIdValidation, respondValidation, respondToRequest);
router.delete('/:id', authenticate, mongoIdValidation, cancelRequest);

export default router;
