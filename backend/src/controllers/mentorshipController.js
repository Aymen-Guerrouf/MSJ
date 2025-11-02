import MentorshipRequest from '../models/mentorshipRequest.model.js';
import User from '../models/user.model.js';

/**
 * Create mentorship request (Connect with mentor)
 * POST /api/mentors/connect
 */
export const createMentorshipRequest = async (req, res, next) => {
  try {
    const { mentorId, message, startupIdeaId } = req.body;

    // Verify mentor exists and is actually a mentor
    const mentor = await User.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    if (!mentor.isMentor) {
      return res.status(400).json({
        success: false,
        message: 'This user is not a mentor',
      });
    }

    // Check if user is trying to mentor themselves
    if (mentorId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request mentorship from yourself',
      });
    }

    // Check for existing pending request
    const existingRequest = await MentorshipRequest.findOne({
      mentor: mentorId,
      mentee: req.user._id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request with this mentor',
      });
    }

    const mentorshipRequest = await MentorshipRequest.create({
      mentor: mentorId,
      mentee: req.user._id,
      startupIdea: startupIdeaId || null,
      message,
      status: 'pending',
    });

    await mentorshipRequest.populate('mentor', 'name email mentorBio mentorExpertise');
    await mentorshipRequest.populate('mentee', 'name email');
    if (startupIdeaId) {
      await mentorshipRequest.populate('startupIdea', 'title category');
    }

    res.status(201).json({
      success: true,
      message: 'Mentorship request sent successfully',
      data: { mentorshipRequest },
    });
  } catch (error) {
    // Handle unique constraint error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request with this mentor',
      });
    }
    next(error);
  }
};

/**
 * Get user's mentorship requests (sent and received)
 * GET /api/mentorship-requests/my
 */
export const getMyMentorshipRequests = async (req, res, next) => {
  try {
    const { status } = req.query;

    const sentFilter = { mentee: req.user._id };
    const receivedFilter = { mentor: req.user._id };

    if (status) {
      sentFilter.status = status;
      receivedFilter.status = status;
    }

    // Requests I've sent
    const sentRequests = await MentorshipRequest.find(sentFilter)
      .populate('mentor', 'name email mentorBio mentorExpertise')
      .populate('startupIdea', 'title category')
      .sort({ createdAt: -1 });

    // Requests I've received (only if I'm a mentor)
    let receivedRequests = [];
    if (req.user.isMentor) {
      receivedRequests = await MentorshipRequest.find(receivedFilter)
        .populate('mentee', 'name email age')
        .populate('startupIdea', 'title category description')
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      data: {
        sent: {
          count: sentRequests.length,
          requests: sentRequests,
        },
        received: {
          count: receivedRequests.length,
          requests: receivedRequests,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update mentorship request status (mentor only)
 * PUT /api/mentorship-requests/:id
 */
export const updateMentorshipRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "rejected"',
      });
    }

    const mentorshipRequest = await MentorshipRequest.findById(req.params.id);

    if (!mentorshipRequest) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found',
      });
    }

    // Only the mentor can update the status
    if (mentorshipRequest.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request',
      });
    }

    // Can only update pending requests
    if (mentorshipRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed',
      });
    }

    mentorshipRequest.status = status;
    await mentorshipRequest.save();

    await mentorshipRequest.populate('mentee', 'name email');
    await mentorshipRequest.populate('startupIdea', 'title category');

    res.json({
      success: true,
      message: `Mentorship request ${status} successfully`,
      data: { mentorshipRequest },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete mentorship request
 * DELETE /api/mentorship-requests/:id
 */
export const deleteMentorshipRequest = async (req, res, next) => {
  try {
    const mentorshipRequest = await MentorshipRequest.findById(req.params.id);

    if (!mentorshipRequest) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found',
      });
    }

    // Only mentee can delete their own request
    if (mentorshipRequest.mentee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request',
      });
    }

    await mentorshipRequest.deleteOne();

    res.json({
      success: true,
      message: 'Mentorship request deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
