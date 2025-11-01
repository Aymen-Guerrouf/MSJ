import express from 'express';
import {
  createParticipation,
  getAllParticipations,
  getParticipationById,
  getMyParticipations,
  updateParticipation,
  deleteParticipation,
} from '../controllers/participationController.js';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Participation:
 *       type: object
 *       required:
 *         - userId
 *         - activityId
 *         - fullName
 *         - phone
 *         - age
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         activityId:
 *           type: string
 *         fullName:
 *           type: string
 *         phone:
 *           type: string
 *         age:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 */

/**
 * @swagger
 * /api/participations:
 *   post:
 *     summary: Register for an event or workshop
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activityId
 *               - fullName
 *               - phone
 *               - age
 *             properties:
 *               activityId:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Already registered or no seats available
 *       404:
 *         description: Activity not found
 */
router.post('/', authenticate, createParticipation);

/**
 * @swagger
 * /api/participations:
 *   get:
 *     summary: Get all participations (Admin only)
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activityId
 *         schema:
 *           type: string
 *         description: Filter by activity ID
 *       - in: query
 *         name: centerId
 *         schema:
 *           type: string
 *         description: Filter by center ID
 *     responses:
 *       200:
 *         description: List of participations
 */
router.get('/', authenticate, isCenterAdmin, getAllParticipations);

/**
 * @swagger
 * /api/participations/my:
 *   get:
 *     summary: Get my participations
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's participations
 */
router.get('/my', authenticate, getMyParticipations);

/**
 * @swagger
 * /api/participations/{id}:
 *   get:
 *     summary: Get participation by ID
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participation details
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Participation not found
 */
router.get('/:id', authenticate, getParticipationById);

/**
 * @swagger
 * /api/participations/{id}:
 *   put:
 *     summary: Update participation
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Participation updated successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Participation not found
 */
router.put('/:id', authenticate, updateParticipation);

/**
 * @swagger
 * /api/participations/{id}:
 *   delete:
 *     summary: Cancel participation
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participation cancelled successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Participation not found
 */
router.delete('/:id', authenticate, deleteParticipation);

export default router;
