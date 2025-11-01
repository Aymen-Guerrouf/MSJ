import express from 'express';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as eventController from '../controllers/eventController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management for youth centers
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: centerId
 *         schema:
 *           type: string
 *         description: Filter events by center ID
 *     responses:
 *       200:
 *         description: List of all events
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event (Center Admin for their center, Super Admin for any)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - centerId
 *               - title
 *             properties:
 *               centerId:
 *                 type: string
 *                 example: "674..."
 *               title:
 *                 type: string
 *                 example: "Football Tournament"
 *               description:
 *                 type: string
 *                 example: "Annual youth football tournament"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               category:
 *                 type: string
 *                 enum: [sports, art, coding, music, theatre, gaming, education, volunteering, chess, other]
 *                 example: "sports"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-01T10:00:00Z"
 *               seats:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Event created successfully
 *       403:
 *         description: Not authorized
 */
router.post('/', authenticate, isCenterAdmin, eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update event
 *     tags: [Events]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [sports, art, coding, music, theatre, gaming, education, volunteering, chess, other]
 *               date:
 *                 type: string
 *                 format: date-time
 *               seats:
 *                 type: number
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event not found
 */
router.put('/:id', authenticate, isCenterAdmin, eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event
 *     tags: [Events]
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
 *         description: Event deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event not found
 */
router.delete('/:id', authenticate, isCenterAdmin, eventController.deleteEvent);

/**
 * @swagger
 * /api/events/my/events:
 *   get:
 *     summary: Get events for current user's managed center
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/my/events', authenticate, isCenterAdmin, eventController.getMyEvents);

export default router;
