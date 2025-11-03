import express from 'express';
import {
  updateUserInfo,
  getHomeInfo,
  deleteUser,
  getAdminDashboard,
  getSuperAdminDashboard,
  getUserById,
  updateUserInterests,
} from '../controllers/userController.js';
import { handleChat, getChatbotInfo } from '../controllers/chatbotController.js';
import { getAllSupervisors } from '../controllers/startupIdeaController.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and personalization
 */

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: AI chatbot and recommendation features
 */

/**
 * @swagger
 * /api/user/chat:
 *   post:
 *     summary: Send a message to the AI chatbot
 *     description: Authenticated users can send messages to the chatbot and receive AI-generated responses.
 *     tags: [Chatbot]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hello, what are today's events?"
 *     responses:
 *       200:
 *         description: Chatbot response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 response:
 *                   type: string
 *                   example: "Today we have a tech innovation meetup in Algiers!"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
router.post('/chat', authenticate, handleChat);

/**
 * @swagger
 * /api/user/info:
 *   get:
 *     summary: Get chatbot and user info
 *     description: Retrieves chatbot details and related user data.
 *     tags: [Chatbot]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Chatbot and user info retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/info', authenticate, getChatbotInfo);

/**
 * @swagger
 * /api/user/eventRecommendation:
 *   get:
 *     summary: Get AI-powered event recommendations
 *     description: Returns personalized event recommendations based on user preferences and location.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       eventName:
 *                         type: string
 *                         example: "AI Hackathon 2025"
 *                       location:
 *                         type: string
 *                         example: "Sétif"
 *                       similarityScore:
 *                         type: number
 *                         example: 0.82
 *       401:
 *         description: Unauthorized
 */
router.get('/eventRecommendation', authenticate, getHomeInfo);

/**
 * @swagger
 * /api/user/updateUser:
 *   patch:
 *     summary: Update user information
 *     description: Allows the authenticated user to update profile details (like name, interests, etc.)
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ilyes Mekalfa"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "AI"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.patch('/updateUser', authenticate, updateUserInfo);

/**
 * @swagger
 * /api/user/interests:
 *   patch:
 *     summary: Update user interests
 *     description: Allows the authenticated user to update their interests for personalized recommendations
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [football, basketball, volleyball, chess, arts, music, theatre, coding, gaming, education, volunteering, culture, tech, health, design, other]
 *                 example: ["coding", "tech", "gaming"]
 *     responses:
 *       200:
 *         description: Interests updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.patch('/interests', authenticate, updateUserInterests);

/**
 * @swagger
 * /api/user/deleteUser:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently deletes the authenticated user's account.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/deleteUser', authenticate, deleteUser);

router.get('/admin/dashboard', authenticate, authorize('center_admin'), getAdminDashboard);
router.get('/superadmin/dashboard', authenticate, authorize('admin'), getSuperAdminDashboard);
router.get('/supervisors', getAllSupervisors);
router.get('/:id', authenticate, getUserById);

export default router;