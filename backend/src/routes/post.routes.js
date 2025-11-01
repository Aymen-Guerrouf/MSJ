import express from 'express';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as postController from '../controllers/postController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: News and announcements for youth centers
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: centerId
 *         schema:
 *           type: string
 *         description: Filter posts by center ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [announcement, news, gallery, update]
 *         description: Filter posts by category
 *     responses:
 *       200:
 *         description: List of all posts
 */
router.get('/', postController.getAllPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 */
router.get('/:id', postController.getPostById);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post (Center Admin for their center, Super Admin for any)
 *     tags: [Posts]
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
 *                 example: "New Coding Workshop"
 *               content:
 *                 type: string
 *                 example: "We are excited to announce a new coding workshop starting next month..."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               category:
 *                 type: string
 *                 enum: [announcement, news, gallery, update]
 *                 example: "announcement"
 *     responses:
 *       201:
 *         description: Post created successfully
 *       403:
 *         description: Not authorized
 */
router.post('/', authenticate, isCenterAdmin, postController.createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update post
 *     tags: [Posts]
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
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *                 enum: [announcement, news, gallery, update]
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Post not found
 */
router.put('/:id', authenticate, isCenterAdmin, postController.updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete post
 *     tags: [Posts]
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
 *         description: Post deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Post not found
 */
router.delete('/:id', authenticate, isCenterAdmin, postController.deletePost);

/**
 * @swagger
 * /api/posts/my/posts:
 *   get:
 *     summary: Get posts for current user's managed center
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/my/posts', authenticate, isCenterAdmin, postController.getMyPosts);

export default router;
