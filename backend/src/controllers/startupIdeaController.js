import StartupIdea from '../models/startupIdea.model.js';
import ProgressSnap from '../models/progressSnap.model.js';

/**
 * Create a new startup idea
 * POST /api/startup-ideas
 */
export const createStartupIdea = async (req, res, next) => {
  try {
    const { title, description, category, center } = req.body;

    const startupIdea = await StartupIdea.create({
      title,
      description,
      category,
      center,
      owner: req.user._id,
      status: 'pending', // Default status
    });

    await startupIdea.populate('owner', 'name email');
    await startupIdea.populate('center', 'name location');

    res.status(201).json({
      success: true,
      message: 'Startup idea created successfully',
      data: { startupIdea },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all approved startup ideas (public feed)
 * GET /api/startup-ideas
 */
export const getAllStartupIdeas = async (req, res, next) => {
  try {
    const { category, center, isSupported } = req.query;

    const filter = { status: 'approved' }; // Only show approved ideas

    if (category) filter.category = category;
    if (center) filter.center = center;
    if (isSupported !== undefined) filter.isSupported = isSupported === 'true';

    const startupIdeas = await StartupIdea.find(filter)
      .populate('owner', 'name email age')
      .populate('center', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: startupIdeas.length,
      data: { startupIdeas },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's startup ideas
 * GET /api/startup-ideas/my
 */
export const getMyStartupIdeas = async (req, res, next) => {
  try {
    const startupIdeas = await StartupIdea.find({ owner: req.user._id })
      .populate('center', 'name location')
      .populate('progressSnaps')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: startupIdeas.length,
      data: { startupIdeas },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single startup idea by ID
 * GET /api/startup-ideas/:id
 */
export const getStartupIdeaById = async (req, res, next) => {
  try {
    const startupIdea = await StartupIdea.findById(req.params.id)
      .populate('owner', 'name email age isMentor mentorExpertise')
      .populate('center', 'name location')
      .populate({
        path: 'progressSnaps',
        populate: { path: 'owner', select: 'name' },
      });

    if (!startupIdea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found',
      });
    }

    res.json({
      success: true,
      data: { startupIdea },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update startup idea (owner only)
 * PUT /api/startup-ideas/:id
 */
export const updateStartupIdea = async (req, res, next) => {
  try {
    const startupIdea = await StartupIdea.findById(req.params.id);

    if (!startupIdea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found',
      });
    }

    // Check ownership
    if (startupIdea.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this startup idea',
      });
    }

    const { title, description, category } = req.body;

    if (title) startupIdea.title = title;
    if (description) startupIdea.description = description;
    if (category) startupIdea.category = category;

    await startupIdea.save();
    await startupIdea.populate('owner', 'name email');
    await startupIdea.populate('center', 'name location');

    res.json({
      success: true,
      message: 'Startup idea updated successfully',
      data: { startupIdea },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete startup idea (owner or admin)
 * DELETE /api/startup-ideas/:id
 */
export const deleteStartupIdea = async (req, res, next) => {
  try {
    const startupIdea = await StartupIdea.findById(req.params.id);

    if (!startupIdea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found',
      });
    }

    // Check ownership or admin
    const isOwner = startupIdea.owner.toString() === req.user._id.toString();
    const isAdmin = ['center_admin', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this startup idea',
      });
    }

    // Delete associated progress snaps
    await ProgressSnap.deleteMany({ startupIdea: startupIdea._id });

    await startupIdea.deleteOne();

    res.json({
      success: true,
      message: 'Startup idea deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add progress snap to startup idea
 * POST /api/startup-ideas/:id/snaps
 */
export const addProgressSnap = async (req, res, next) => {
  try {
    const startupIdea = await StartupIdea.findById(req.params.id);

    if (!startupIdea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found',
      });
    }

    // Check ownership
    if (startupIdea.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add progress to this startup idea',
      });
    }

    const { text, imageUrl } = req.body;

    const progressSnap = await ProgressSnap.create({
      startupIdea: startupIdea._id,
      text,
      imageUrl,
      owner: req.user._id,
    });

    await progressSnap.populate('owner', 'name');

    res.status(201).json({
      success: true,
      message: 'Progress snap added successfully',
      data: { progressSnap },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all progress snaps for a startup idea
 * GET /api/startup-ideas/:id/snaps
 */
export const getProgressSnaps = async (req, res, next) => {
  try {
    const startupIdea = await StartupIdea.findById(req.params.id);

    if (!startupIdea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found',
      });
    }

    const progressSnaps = await ProgressSnap.find({ startupIdea: req.params.id })
      .populate('owner', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: progressSnaps.length,
      data: { progressSnaps },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete progress snap (owner or admin)
 * DELETE /api/startup-ideas/snaps/:snapId
 */
export const deleteProgressSnap = async (req, res, next) => {
  try {
    const progressSnap = await ProgressSnap.findById(req.params.snapId);

    if (!progressSnap) {
      return res.status(404).json({
        success: false,
        message: 'Progress snap not found',
      });
    }

    // Check ownership or admin
    const isOwner = progressSnap.owner.toString() === req.user._id.toString();
    const isAdmin = ['center_admin', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this progress snap',
      });
    }

    await progressSnap.deleteOne();

    res.json({
      success: true,
      message: 'Progress snap deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all pending startup ideas (admin only)
 * GET /api/startup-ideas/pending
 */
export const getPendingStartupIdeas = async (req, res, next) => {
  try {
    const startupIdeas = await StartupIdea.find({ status: 'pending' })
      .populate('owner', 'name email age')
      .populate('center', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: startupIdeas.length,
      data: { startupIdeas },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update startup idea status (admin only)
 * PUT /api/startup-ideas/:id/status
 */
export const updateStartupIdeaStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"',
      });
    }

    const startupIdea = await StartupIdea.findById(req.params.id);

    if (!startupIdea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found',
      });
    }

    startupIdea.status = status;
    await startupIdea.save();

    await startupIdea.populate('owner', 'name email');
    await startupIdea.populate('center', 'name location');

    res.json({
      success: true,
      message: `Startup idea ${status} successfully`,
      data: { startupIdea },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle support badge (admin only)
 * PUT /api/startup-ideas/:id/support
 */
export const toggleSupportBadge = async (req, res, next) => {
  try {
    const { isSupported } = req.body;

    if (typeof isSupported !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isSupported must be a boolean value',
      });
    }

    const startupIdea = await StartupIdea.findById(req.params.id);

    if (!startupIdea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found',
      });
    }

    startupIdea.isSupported = isSupported;
    await startupIdea.save();

    await startupIdea.populate('owner', 'name email');
    await startupIdea.populate('center', 'name location');

    res.json({
      success: true,
      message: `Support badge ${isSupported ? 'granted' : 'revoked'} successfully`,
      data: { startupIdea },
    });
  } catch (error) {
    next(error);
  }
};
