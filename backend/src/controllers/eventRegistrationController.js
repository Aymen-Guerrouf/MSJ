import EventRegistration from '../models/eventRegistration.model.js';
import Event from '../models/event.model.js';

/**
 * Register for an event
 */
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId, fullName, phone, age } = req.body;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is open
    if (event.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Event registration is closed',
      });
    }

    // Check if user already registered (unique index will also catch this)
    const existingRegistration = await EventRegistration.findOne({
      userId: req.user._id,
      eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Create registration - instant join
    const registration = await EventRegistration.create({
      userId: req.user._id,
      eventId,
      fullName,
      phone,
      age,
    });

    const populatedRegistration = await EventRegistration.findById(registration._id)
      .populate('eventId', 'title date category centerId')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      data: { registration: populatedRegistration },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all event registrations (Admin)
 */
export const getAllEventRegistrations = async (req, res, next) => {
  try {
    const { eventId, userId } = req.query;

    const filter = {};
    if (eventId) filter.eventId = eventId;
    if (userId) filter.userId = userId;

    // Center admin can only see registrations for their center's events
    if (req.user.role === 'center_admin') {
      const events = await Event.find({ centerId: req.user.managedCenterId }).select('_id');
      const eventIds = events.map((e) => e._id);
      filter.eventId = { $in: eventIds };
    }

    const registrations = await EventRegistration.find(filter)
      .populate('userId', 'name email')
      .populate('eventId', 'title date category centerId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: { registrations },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my event registrations
 */
export const getMyEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ userId: req.user._id })
      .populate('eventId', 'title date category image centerId status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: { registrations },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel event registration (Delete)
 */
export const cancelEventRegistration = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Only the user who registered can cancel
    if (registration.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own registrations',
      });
    }

    // Delete registration
    await EventRegistration.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event registration (Admin only)
 */
export const deleteEventRegistration = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    await EventRegistration.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
