import express from 'express';
import {
  createWorkshop,
  getAllWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop,
  getMyWorkshops,
} from '../controllers/workshopController.js';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Workshop:
 *       type: object
 *       required:
 *         - centerId
 *         - title
 *         - description
 *         - category
 *         - date
 *         - mentorId
 *       properties:
 *         _id:
 *           type: string
 *         centerId:
 *           type: string
 *         kind:
 *           type: string
 *           enum: [workshop]
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *           enum: [tech, arts, language, skills, health, business, science, other]
 *         mentorId:
 *           type: string
 *         image:
 *           type: string
 *         seats:
 *           type: number
 *         bookedCount:
 *           type: number
 *         price:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           description: Workshop price in DZD (0 for free workshops)
 *         status:
 *           type: string
 *           enum: [open, closed]
 */

/**
 * @swagger
 * /api/workshops:
 *   post:
 *     summary: Create a new workshop
 *     tags: [Workshops]
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
 *               - description
 *               - category
 *               - date
 *               - mentorId
 *             properties:
 *               centerId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [tech, arts, language, skills, health, business, science, other]
 *               date:
 *                 type: string
 *                 format: date-time
 *               mentorId:
 *                 type: string
 *               image:
 *                 type: string
 *               seats:
 *                 type: number
 *                 default: 40
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *                 description: Workshop price in DZD (0 for free workshops)
 *     responses:
 *       201:
 *         description: Workshop created successfully
 *       403:
 *         description: Permission denied
 */
router.post('/', authenticate, isCenterAdmin, createWorkshop);

/**
 * @swagger
 * /api/workshops:
 *   get:
 *     summary: Get all workshops
 *     tags: [Workshops]
 *     parameters:
 *       - in: query
 *         name: centerId
 *         schema:
 *           type: string
 *         description: Filter by center ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of all workshops
 */
router.get('/', authenticate, getAllWorkshops);

/**
 * @swagger
 * /api/workshops/my:
 *   get:
 *     summary: Get workshops for center admin's center
 *     tags: [Workshops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workshops for the admin's center
 *       403:
 *         description: Only center admins can use this endpoint
 */
router.get('/my', authenticate, getMyWorkshops);

/**
 * @swagger
 * /api/workshops/{id}:
 *   get:
 *     summary: Get workshop by ID
 *     tags: [Workshops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workshop details
 *       404:
 *         description: Workshop not found
 */
router.get('/:id', authenticate, getWorkshopById);

/**
 * @swagger
 * /api/workshops/{id}:
 *   put:
 *     summary: Update workshop
 *     tags: [Workshops]
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
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               mentorId:
 *                 type: string
 *               image:
 *                 type: string
 *               seats:
 *                 type: number
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Workshop price in DZD (0 for free workshops)
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workshop updated successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Workshop not found
 */
router.put('/:id', authenticate, isCenterAdmin, updateWorkshop);

/**
 * @swagger
 * /api/workshops/{id}:
 *   delete:
 *     summary: Delete workshop
 *     tags: [Workshops]
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
 *         description: Workshop deleted successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Workshop not found
 */
router.delete('/:id', authenticate, isCenterAdmin, deleteWorkshop);

export default router;
