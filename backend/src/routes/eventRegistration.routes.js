import express from 'express';
import * as eventRegistrationController from '../controllers/eventRegistrationController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isCenterAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Event Registrations
 *   description: Event registration management
 */

/**
 * @swagger
 * /api/event-registrations:
 *   get:
 *     summary: Get all event registrations (Admin)
 *     tags: [Event Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of event registrations
 */
router.get('/', authenticate, isCenterAdmin, eventRegistrationController.getAllEventRegistrations);

/**
 * @swagger
 * /api/event-registrations/my:
 *   get:
 *     summary: Get my event registrations
 *     tags: [Event Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my event registrations
 */
router.get('/my', authenticate, eventRegistrationController.getMyEventRegistrations);

/**
 * @swagger
 * /api/event-registrations:
 *   post:
 *     summary: Register for an event
 *     tags: [Event Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - fullName
 *               - phone
 *               - age
 *             properties:
 *               eventId:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       201:
 *         description: Successfully registered for event
 */
router.post('/', authenticate, eventRegistrationController.registerForEvent);

/**
 * @swagger
 * /api/event-registrations/{id}/cancel:
 *   put:
 *     summary: Cancel event registration
 *     tags: [Event Registrations]
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
 *         description: Registration cancelled successfully
 */
router.put('/:id/cancel', authenticate, eventRegistrationController.cancelEventRegistration);

/**
 * @swagger
 * /api/event-registrations/{id}:
 *   delete:
 *     summary: Delete event registration (Admin)
 *     tags: [Event Registrations]
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
 *         description: Registration deleted successfully
 */
router.delete(
  '/:id',
  authenticate,
  isCenterAdmin,
  eventRegistrationController.deleteEventRegistration
);

export default router;
