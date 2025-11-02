import express from 'express';
import { authenticate, isCenterAdmin } from '../middleware/auth.middleware.js';
import * as virtualSchoolController from '../controllers/virtualSchoolVideos.js';

const router = express.Router();

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
