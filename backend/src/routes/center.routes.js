import express from 'express';
import { authenticate, isSuperAdmin, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as centerController from '../controllers/centerController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Centers
 *   description: Youth center management
 */

/**
 * @swagger
 * /api/centers:
 *   get:
 *     summary: Get all centers
 *     tags: [Centers]
 *     parameters:
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: Comma-separated list of relations to include (clubs, events, workshops, all)
 *     responses:
 *       200:
 *         description: List of all centers with optional related data
 */
router.get('/', centerController.getAllCenters);

/**
 * @swagger
 * /api/centers/{id}:
 *   get:
 *     summary: Get center by ID
 *     tags: [Centers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: Comma-separated list of relations to include (clubs, events, workshops, all)
 *     responses:
 *       200:
 *         description: Center details with optional related data
 *       404:
 *         description: Center not found
 */
router.get('/:id', centerController.getCenterById);

/**
 * @swagger
 * /api/centers/my/centers:
 *   get:
 *     summary: Get centers managed by current user
 *     tags: [Centers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of managed centers
 */
router.get('/my/centers', authenticate, isCenterAdmin, centerController.getMyCenters);

/**
 * @swagger
 * /api/centers:
 *   post:
 *     summary: Create a new center (Super Admin only)
 *     tags: [Centers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - wilaya
 *               - commune
 *               - address
 *               - coordinates
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Youth Center Algiers"
 *               description:
 *                 type: string
 *                 example: "A community center for youth activities"
 *               wilaya:
 *                 type: string
 *                 example: "Algiers"
 *               commune:
 *                 type: string
 *                 example: "Bab Ezzouar"
 *               address:
 *                 type: string
 *                 example: "123 Main Street"
 *               phone:
 *                 type: string
 *                 example: "0555123456"
 *               email:
 *                 type: string
 *                 example: "center@example.com"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [3.1838, 36.7064]
 *                 description: "[longitude, latitude]"
 *     responses:
 *       201:
 *         description: Center created successfully
 *       403:
 *         description: Super admin access required
 */
router.post('/', authenticate, isSuperAdmin, centerController.createCenter);

/**
 * @swagger
 * /api/centers/{id}:
 *   put:
 *     summary: Update center (Super Admin or assigned Center Admin)
 *     tags: [Centers]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               wilaya:
 *                 type: string
 *               commune:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Center updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Center not found
 */
router.put('/:id', authenticate, isCenterAdmin, centerController.updateCenter);

/**
 * @swagger
 * /api/centers/{id}:
 *   delete:
 *     summary: Delete center (Super Admin only)
 *     tags: [Centers]
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
 *         description: Center deleted successfully
 *       403:
 *         description: Super admin access required
 *       404:
 *         description: Center not found
 */
router.delete('/:id', authenticate, isSuperAdmin, centerController.deleteCenter);

/**
 * @swagger
 * /api/centers/assign-admin:
 *   post:
 *     summary: Assign a user as center admin (Super Admin only)
 *     tags: [Centers]
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
 *               - userId
 *             properties:
 *               centerId:
 *                 type: string
 *                 example: "674..."
 *               userId:
 *                 type: string
 *                 example: "674..."
 *     responses:
 *       200:
 *         description: Center admin assigned successfully
 *       403:
 *         description: Super admin access required
 *       404:
 *         description: Center or user not found
 */
router.post('/assign-admin', authenticate, isSuperAdmin, centerController.assignCenterAdmin);

/**
 * @swagger
 * /api/centers/remove-admin:
 *   post:
 *     summary: Remove center admin from a center (Super Admin only)
 *     tags: [Centers]
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
 *               - userId
 *             properties:
 *               centerId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Center admin removed successfully
 *       403:
 *         description: Super admin access required
 */
router.post('/remove-admin', authenticate, isSuperAdmin, centerController.removeCenterAdmin);

export default router;
