import Participation from '../models/participation.model.js';
import Event from '../models/event.model.js';
import Workshop from '../models/workshop.model.js';

/**
 * Register for an event or workshop (Authenticated users only)
 */
export const createParticipation = async (req, res, next) => {
  try {
    const { activityId, activityType, fullName, phone, age } = req.body;

    // Validate activityType
    if (!['Event', 'Workshop'].includes(activityType)) {
      return res.status(400).json({
        success: false,
        message: 'activityType must be either "Event" or "Workshop"',
      });
    }

    // Check if activity exists and is open
    const Model = activityType === 'Event' ? Event : Workshop;
    const activity = await Model.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: `${activityType} not found`,
      });
    }

    if (activity.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'This activity is closed for registration',
      });
    }

    // Check if seats are available
    if (activity.bookedCount >= activity.seats) {
      return res.status(400).json({
        success: false,
        message: 'No seats available for this activity',
      });
    }

    // Check if user already registered
    const existingParticipation = await Participation.findOne({
      userId: req.user._id,
      activityId,
    });

    if (existingParticipation) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this activity',
      });
    }

    // Create participation
    const participation = new Participation({
      userId: req.user._id,
      activityId,
      activityType,
      fullName,
      phone,
      age,
    });

    await participation.save();

    // Increment bookedCount
    activity.bookedCount += 1;
    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the activity',
      data: { participation },
    });
  } catch (error) {
    // Handle duplicate key error (unique constraint on userId + activityId)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this activity',
      });
    }
    next(error);
  }
};

/**
 * Get all participations (Admin only - for managing registrations)
 */
export const getAllParticipations = async (req, res, next) => {
  try {
    const { activityId, centerId } = req.query;

    const filter = {};

    // If center admin, only show their center's events and workshops
    if (req.user.role === 'center_admin') {
      const events = await Event.find({ centerId: req.user.managedCenterId }).select('_id');
      const workshops = await Workshop.find({ centerId: req.user.managedCenterId }).select('_id');
      const activityIds = [...events.map((e) => e._id), ...workshops.map((w) => w._id)];
      filter.activityId = { $in: activityIds };
    } else if (activityId) {
      // Super admin can filter by specific activity
      filter.activityId = activityId;
    } else if (centerId) {
      // Super admin can filter by center
      const events = await Event.find({ centerId }).select('_id');
      const workshops = await Workshop.find({ centerId }).select('_id');
      const activityIds = [...events.map((e) => e._id), ...workshops.map((w) => w._id)];
      filter.activityId = { $in: activityIds };
    }

    const participations = await Participation.find(filter)
      .populate('userId', 'name email')
      .populate({
        path: 'activityId',
        select: 'title date centerId',
        populate: { path: 'centerId', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: participations.length,
      data: { participations },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single participation by ID
 */
export const getParticipationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const participation = await Participation.findById(id)
      .populate('userId', 'name email')
      .populate({
        path: 'activityId',
        select: 'title kind date centerId',
        populate: { path: 'centerId', select: 'name' },
      });

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Participation not found',
      });
    }

    // Check permissions - users can only view their own, admins can view all
    if (
      req.user.role === 'user' &&
      participation.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own registrations',
      });
    }

    // Center admins can only view participations for their center
    if (req.user.role === 'center_admin') {
      const activity = await Activity.findById(participation.activityId);
      if (activity.centerId.toString() !== req.user.managedCenterId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only view registrations for your center',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: { participation },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my participations (for authenticated user)
 */
export const getMyParticipations = async (req, res, next) => {
  try {
    const participations = await Participation.find({ userId: req.user._id })
      .populate({
        path: 'activityId',
        select: 'title kind date seats bookedCount status centerId',
        populate: { path: 'centerId', select: 'name wilaya' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: participations.length,
      data: { participations },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update participation (User can update their own, admins can update any)
 */
export const updateParticipation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const participation = await Participation.findById(id);
    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Participation not found',
      });
    }

    // Check permissions
    if (req.user.role === 'user' && participation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own registrations',
      });
    }

    // Center admins can only update participations for their center
    if (req.user.role === 'center_admin') {
      const activity = await Activity.findById(participation.activityId);
      if (activity.centerId.toString() !== req.user.managedCenterId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update registrations for your center',
        });
      }
    }

    // Don't allow changing userId or activityId
    delete updates.userId;
    delete updates.activityId;

    Object.assign(participation, updates);
    await participation.save();

    res.status(200).json({
      success: true,
      message: 'Participation updated successfully',
      data: { participation },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel participation (User can cancel their own, admins can cancel any)
 */
export const deleteParticipation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const participation = await Participation.findById(id);
    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Participation not found',
      });
    }

    // Check permissions
    if (req.user.role === 'user' && participation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own registrations',
      });
    }

    // Center admins can only cancel participations for their center
    if (req.user.role === 'center_admin') {
      const activity = await Activity.findById(participation.activityId);
      if (activity.centerId.toString() !== req.user.managedCenterId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only cancel registrations for your center',
        });
      }
    }

    // Decrement bookedCount
    const activity = await Activity.findById(participation.activityId);
    if (activity && activity.bookedCount > 0) {
      activity.bookedCount -= 1;
      await activity.save();
    }

    await Participation.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Participation cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
