import express from 'express';
import {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  getMyClubs,
  addMemberToClub,
  removeMemberFromClub,
} from '../controllers/clubController.js';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Club:
 *       type: object
 *       required:
 *         - centerId
 *         - name
 *         - description
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *         centerId:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           enum: [sports, arts, tech, culture, other]
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs for club gallery
 *         memberIds:
 *           type: array
 *           items:
 *             type: string
 *         createdBy:
 *           type: string
 */

/**
 * @swagger
 * /api/clubs:
 *   post:
 *     summary: Create a new club
 *     tags: [Clubs]
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
 *               - name
 *               - description
 *               - category
 *             properties:
 *               centerId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [sports, arts, tech, culture, other]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs for club gallery
 *     responses:
 *       201:
 *         description: Club created successfully
 *       403:
 *         description: Permission denied
 */
router.post('/', authenticate, isCenterAdmin, createClub);

/**
 * @swagger
 * /api/clubs:
 *   get:
 *     summary: Get all clubs
 *     tags: [Clubs]
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
 *     responses:
 *       200:
 *         description: List of all clubs
 */
router.get('/', authenticate, getAllClubs);

/**
 * @swagger
 * /api/clubs/my:
 *   get:
 *     summary: Get clubs for center admin's center
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clubs for the admin's center
 *       403:
 *         description: Only center admins can use this endpoint
 */
router.get('/my', authenticate, getMyClubs);

/**
 * @swagger
 * /api/clubs/{id}:
 *   get:
 *     summary: Get club by ID
 *     tags: [Clubs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Club details
 *       404:
 *         description: Club not found
 */
router.get('/:id', authenticate, getClubById);

/**
 * @swagger
 * /api/clubs/{id}:
 *   put:
 *     summary: Update club
 *     tags: [Clubs]
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
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs for club gallery
 *     responses:
 *       200:
 *         description: Club updated successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Club not found
 */
router.put('/:id', authenticate, isCenterAdmin, updateClub);

/**
 * @swagger
 * /api/clubs/{id}:
 *   delete:
 *     summary: Delete club
 *     tags: [Clubs]
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
 *         description: Club deleted successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Club not found
 */
router.delete('/:id', authenticate, isCenterAdmin, deleteClub);

/**
 * @swagger
 * /api/clubs/{id}/members:
 *   post:
 *     summary: Add member to club (join club)
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
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
 *               userId:
 *                 type: string
 *                 description: User ID (optional, defaults to current user)
 *     responses:
 *       200:
 *         description: Member added successfully
 *       400:
 *         description: Already a member
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Club or user not found
 */
router.post('/:id/members', authenticate, addMemberToClub);

/**
 * @swagger
 * /api/clubs/{id}/members/{userId}:
 *   delete:
 *     summary: Remove member from club (leave club)
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       400:
 *         description: User is not a member
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Club not found
 */
router.delete('/:id/members/:userId', authenticate, removeMemberFromClub);

export default router;
