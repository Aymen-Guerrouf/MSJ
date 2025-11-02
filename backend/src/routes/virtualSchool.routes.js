import express from 'express';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as virtualSchoolController from '../controllers/virtualSchoolVideos.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Virtual School
 *   description: Educational video content
 */

/**
 * @swagger
 * /api/virtual-school:
 *   get:
 *     summary: Get all educational videos
 *     tags: [Virtual School]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: centerId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of videos
 *   post:
 *     summary: Create educational video with Cloudinary URLs (Admin only)
 *     tags: [Virtual School]
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
 *               - category
 *               - videoUrl
 *               - centerId
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [football, basketball, volleyball, chess, arts, music, theatre, coding, gaming, education, volunteering, culture, tech, health, entrepreneurship, design, marketing, other]
 *               description:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *                 description: Pre-uploaded Cloudinary video URL
 *               thumbnailUrl:
 *                 type: string
 *                 description: Optional pre-uploaded Cloudinary thumbnail URL
 *               duration:
 *                 type: number
 *                 description: Video duration in seconds
 *               centerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video created with Cloudinary URLs
 */

/**
 * @swagger
 * /api/virtual-school/{id}:
 *   get:
 *     summary: Watch video (increments view count)
 *     tags: [Virtual School]
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
 *         description: Video details
 *   put:
 *     summary: Update video (Admin only)
 *     tags: [Virtual School]
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
 *         description: Video updated
 *   delete:
 *     summary: Delete video (Admin only)
 *     tags: [Virtual School]
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
 *         description: Video deleted
 */

// Get all videos (public with auth)
router.get('/', authenticate, virtualSchoolController.listVideos);

// Get single video
router.get('/:id', authenticate, virtualSchoolController.getVideo);

// Create video (center admin only)
router.post('/', authenticate, isCenterAdmin, virtualSchoolController.createVideo);

// Update video (center admin only)
router.put('/:id', authenticate, isCenterAdmin, virtualSchoolController.updateVideo);

// Delete video (center admin only)
router.delete('/:id', authenticate, isCenterAdmin, virtualSchoolController.deleteVideo);

export default router;
