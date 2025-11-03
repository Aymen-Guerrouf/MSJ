import StartupIdea from '../models/startupIdea.model.js';
import User from '../models/user.model.js';
import ProgressSnap from '../models/progressSnap.model.js';

/**
 * @desc    Get all public startup ideas (Sparks Hub)
 * @route   GET /api/startup-ideas
 * @access  Public
 */
export const getAllStartupIdeas = async (req, res, next) => {
  try {
    const { category, stage, search } = req.query;

    const filter = { status: 'public' }; // Only show public projects

    if (category) filter.category = category;
    if (stage) filter.stage = stage;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const startupIdeas = await StartupIdea.find(filter)
      .populate('owner', 'name email')
      .populate('supervisor', 'name supervisorTitle')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: startupIdeas.length,
      data: startupIdeas,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single startup idea by ID
 * @route   GET /api/startup-ideas/:id
 * @access  Public (but restricted based on status)
 */
export const getStartupIdeaById = async (req, res, next) => {
  try {
    const startupIdea = await StartupIdea.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('supervisor', 'name supervisorTitle supervisorBio supervisorExpertise')
      .populate('progressUpdates');

    if (!startupIdea) {
      return res.status(404).json({
        success: false,
        message: 'Startup idea not found',
      });
    }

    // Only show public projects or if user is owner/supervisor
    if (startupIdea.status !== 'public') {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this project',
        });
      }

      const isOwner = req.user._id.toString() === startupIdea.owner._id.toString();
      const isSupervisor =
        startupIdea.supervisor && req.user._id.toString() === startupIdea.supervisor._id.toString();

      if (!isOwner && !isSupervisor) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this project',
        });
      }
    }

    res.json({
      success: true,
      data: startupIdea,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all supervisors (users with isSupervisor: true)
 * @route   GET /api/users/supervisors
 * @access  Public
 */
export const getAllSupervisors = async (req, res, next) => {
  try {
    const { expertise, search } = req.query;

    const filter = { isSupervisor: true };

    if (expertise) {
      filter.supervisorExpertise = expertise;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { supervisorTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const supervisors = await User.find(filter)
      .select('name email supervisorTitle supervisorBio supervisorExpertise')
      .sort({ name: 1 })
      .lean();

    res.json({
      success: true,
      count: supervisors.length,
      data: supervisors,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new startup idea
 * @route   POST /api/startup-ideas
 * @access  Private
 */
export const createStartupIdea = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      images,
      problemStatement,
      solution,
      targetMarket,
      businessModel,
      stage,
      needs,
      teamMembers,
    } = req.body;

    // Check if user already has a project
    const existingProject = await StartupIdea.findOne({ owner: req.user._id });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'You already have a project. You can only create one project at a time.',
      });
    }

    const startupIdea = await StartupIdea.create({
      title,
      description,
      category,
      images: images || [],
      problemStatement,
      solution,
      targetMarket,
      businessModel: businessModel || 'Not Sure Yet',
      stage: stage || 'Idea',
      needs: needs || [],
      teamMembers: teamMembers || [],
      owner: req.user._id,
      status: 'pending', // Default status
    });

    const populatedIdea = await StartupIdea.findById(startupIdea._id).populate(
      'owner',
      'name email'
    );

    res.status(201).json({
      success: true,
      message: 'Startup idea created successfully',
      data: populatedIdea,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get entrepreneur's own project dashboard
 * @route   GET /api/startup-ideas/my-project
 * @access  Private
 */
export const getMyProject = async (req, res, next) => {
  try {
    const project = await StartupIdea.findOne({ owner: req.user._id })
      .populate('supervisor', 'name supervisorTitle supervisorBio supervisorExpertise')
      .populate('progressUpdates');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a project yet',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update entrepreneur's own project
 * @route   PUT /api/startup-ideas/my-project
 * @access  Private
 */
export const updateMyProject = async (req, res, next) => {
  try {
    const project = await StartupIdea.findOne({ owner: req.user._id });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a project to update',
      });
    }

    const {
      title,
      description,
      category,
      images,
      problemStatement,
      solution,
      targetMarket,
      businessModel,
      stage,
      needs,
      teamMembers,
    } = req.body;

    // Update fields if provided
    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (images !== undefined) project.images = images;
    if (problemStatement) project.problemStatement = problemStatement;
    if (solution) project.solution = solution;
    if (targetMarket) project.targetMarket = targetMarket;
    if (businessModel) project.businessModel = businessModel;
    if (stage) project.stage = stage;
    if (needs !== undefined) project.needs = needs;
    if (teamMembers !== undefined) project.teamMembers = teamMembers;

    await project.save();

    const updatedProject = await StartupIdea.findById(project._id)
      .populate('supervisor', 'name supervisorTitle')
      .populate('progressUpdates');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete entrepreneur's own project
 * @route   DELETE /api/startup-ideas/my-project
 * @access  Private
 */
export const deleteMyProject = async (req, res, next) => {
  try {
    const project = await StartupIdea.findOne({ owner: req.user._id });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a project to delete',
      });
    }

    // Delete associated progress snaps
    await ProgressSnap.deleteMany({ startupIdea: project._id });

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
