import ProjectRequest from '../models/projectRequest.model.js';
import StartupIdea from '../models/startupIdea.model.js';
import User from '../models/user.model.js';
import { sendProjectRequestEmail } from '../config/email.service.js';

/**
 * @desc    Create a new project request (Send Request button)
 * @route   POST /api/project-requests
 * @access  Private
 */
export const createProjectRequest = async (req, res, next) => {
  try {
    const { supervisorId, message } = req.body;

    if (!supervisorId) {
      return res.status(400).json({
        success: false,
        message: 'Supervisor ID is required',
      });
    }

    // Check if supervisor exists and is actually a supervisor
    const supervisor = await User.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found',
      });
    }

    if (!supervisor.isSupervisor) {
      return res.status(400).json({
        success: false,
        message: 'Selected user is not a supervisor',
      });
    }

    // Get entrepreneur's project
    const project = await StartupIdea.findOne({ owner: req.user._id });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'You must have a project before sending a request',
      });
    }

    // Check if project is in pending status
    if (project.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Project must be in pending status to send a request',
      });
    }

    // *** CRITICAL: Check if entrepreneur already has a pending request ***
    const existingPendingRequest = await ProjectRequest.findOne({
      entrepreneur: req.user._id,
      status: 'pending',
    });
    
    if (existingPendingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request. You can only send one request at a time.',
      });
    }

    // Check if there's already a request for this project-supervisor pair
    const existingRequest = await ProjectRequest.findOne({
      startupIdea: project._id,
      supervisor: supervisorId,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a request to this supervisor for this project',
      });
    }

    // Create the request
    const projectRequest = await ProjectRequest.create({
      startupIdea: project._id,
      entrepreneur: req.user._id,
      supervisor: supervisorId,
      message: message || '',
      status: 'pending',
    });

    // Update project status to pending_review
    project.status = 'pending_review';
    await project.save();

    const populatedRequest = await ProjectRequest.findById(projectRequest._id)
      .populate('startupIdea', 'title description category stage problemStatement')
      .populate('entrepreneur', 'name email')
      .populate('supervisor', 'name email supervisorTitle');

    // Send email notification to supervisor
    try {
      await sendProjectRequestEmail(
        populatedRequest.supervisor,
        populatedRequest.entrepreneur,
        populatedRequest.startupIdea,
        projectRequest._id,
        message
      );
    } catch (emailError) {
      // Log error but don't fail the request
      console.error('Failed to send email notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Project request sent successfully',
      data: populatedRequest,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get entrepreneur's sent requests
 * @route   GET /api/project-requests/my-requests
 * @access  Private
 */
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await ProjectRequest.find({ entrepreneur: req.user._id })
      .populate('startupIdea', 'title description category status')
      .populate('supervisor', 'name email supervisorTitle supervisorBio')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Respond to a project request (Approve/Reject button via email link)
 * @route   PUT /api/project-requests/:id/respond
 * @access  Private (Supervisors only)
 */
export const respondToRequest = async (req, res, next) => {
  try {
    const { status, responseMessage } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"',
      });
    }

    const request = await ProjectRequest.findById(req.params.id).populate('startupIdea');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found',
      });
    }

    // Check if user is the supervisor for this request
    if (request.supervisor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this request',
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been responded to',
      });
    }

    // Update request status
    request.status = status;
    request.responseMessage = responseMessage || '';
    request.respondedAt = new Date();
    await request.save();

    // Update startup idea based on response
    const startupIdea = await StartupIdea.findById(request.startupIdea._id);

    if (status === 'approved') {
      // Assign supervisor and make public
      startupIdea.supervisor = req.user._id;
      startupIdea.status = 'public';
    } else {
      // Rejected - set back to pending
      startupIdea.status = 'pending';
    }

    await startupIdea.save();

    const populatedRequest = await ProjectRequest.findById(request._id)
      .populate('startupIdea', 'title description category status')
      .populate('entrepreneur', 'name email')
      .populate('supervisor', 'name supervisorTitle');

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: populatedRequest,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Cancel a pending request
 * @route   DELETE /api/project-requests/:id
 * @access  Private (Entrepreneur only)
 */
export const cancelRequest = async (req, res, next) => {
  try {
    const request = await ProjectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found',
      });
    }

    // Check if user is the entrepreneur
    if (request.entrepreneur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request',
      });
    }

    // Can only cancel pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending requests',
      });
    }

    // Update project status back to pending
    const project = await StartupIdea.findById(request.startupIdea);
    if (project) {
      project.status = 'pending';
      await project.save();
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: 'Request cancelled successfully',
    });
  } catch (err) {
    next(err);
  }
};