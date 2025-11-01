import express from 'express';
import * as workshopEnrollmentController from '../controllers/workshopEnrollmentController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isCenterAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Workshop Enrollments
 *   description: Workshop enrollment management
 */

/**
 * @swagger
 * /api/workshop-enrollments:
 *   get:
 *     summary: Get all workshop enrollments (Admin)
 *     tags: [Workshop Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: workshopId
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of workshop enrollments
 */
router.get(
  '/',
  authenticate,
  isCenterAdmin,
  workshopEnrollmentController.getAllWorkshopEnrollments
);

/**
 * @swagger
 * /api/workshop-enrollments/my:
 *   get:
 *     summary: Get my workshop enrollments
 *     tags: [Workshop Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my workshop enrollments
 */
router.get('/my', authenticate, workshopEnrollmentController.getMyWorkshopEnrollments);

/**
 * @swagger
 * /api/workshop-enrollments:
 *   post:
 *     summary: Enroll in a workshop
 *     tags: [Workshop Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workshopId
 *               - fullName
 *               - phone
 *               - age
 *             properties:
 *               workshopId:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       201:
 *         description: Successfully enrolled in workshop
 */
router.post('/', authenticate, workshopEnrollmentController.enrollInWorkshop);

/**
 * @swagger
 * /api/workshop-enrollments/{id}/payment:
 *   put:
 *     summary: Update payment status (Admin)
 *     tags: [Workshop Enrollments]
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
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, refunded]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 */
router.put(
  '/:id/payment',
  authenticate,
  isCenterAdmin,
  workshopEnrollmentController.updatePaymentStatus
);

/**
 * @swagger
 * /api/workshop-enrollments/{id}/cancel:
 *   put:
 *     summary: Cancel workshop enrollment
 *     tags: [Workshop Enrollments]
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
 *         description: Enrollment cancelled successfully
 */
router.put('/:id/cancel', authenticate, workshopEnrollmentController.cancelWorkshopEnrollment);

/**
 * @swagger
 * /api/workshop-enrollments/{id}:
 *   delete:
 *     summary: Delete workshop enrollment (Admin)
 *     tags: [Workshop Enrollments]
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
 *         description: Enrollment deleted successfully
 */
router.delete(
  '/:id',
  authenticate,
  isCenterAdmin,
  workshopEnrollmentController.deleteWorkshopEnrollment
);

export default router;
