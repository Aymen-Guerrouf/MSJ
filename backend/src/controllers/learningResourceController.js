import LearningResource from '../models/learningResource.model.js';

/**
 * Get all learning resources (public)
 * GET /api/learning-resources
 */
export const getLearningResources = async (req, res, next) => {
  try {
    const { category, center } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (center) filter.center = center;

    const resources = await LearningResource.find(filter)
      .populate('center', 'name location')
      .populate('addedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: resources.length,
      data: { resources },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create learning resource (admin only)
 * POST /api/learning-resources
 */
export const createLearningResource = async (req, res, next) => {
  try {
    const { title, url, description, category, center } = req.body;

    const resource = await LearningResource.create({
      title,
      url,
      description,
      category,
      center,
      addedBy: req.user._id,
    });

    await resource.populate('center', 'name location');
    await resource.populate('addedBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Learning resource created successfully',
      data: { resource },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update learning resource (admin only)
 * PUT /api/learning-resources/:id
 */
export const updateLearningResource = async (req, res, next) => {
  try {
    const { title, url, description, category } = req.body;

    const resource = await LearningResource.findByIdAndUpdate(
      req.params.id,
      { title, url, description, category },
      { new: true, runValidators: true }
    )
      .populate('center', 'name location')
      .populate('addedBy', 'name role');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Learning resource not found',
      });
    }

    res.json({
      success: true,
      message: 'Learning resource updated successfully',
      data: { resource },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete learning resource (admin only)
 * DELETE /api/learning-resources/:id
 */
export const deleteLearningResource = async (req, res, next) => {
  try {
    const resource = await LearningResource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Learning resource not found',
      });
    }

    res.json({
      success: true,
      message: 'Learning resource deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
