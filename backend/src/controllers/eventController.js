import Event from '../models/event.model.js';
import Center from '../models/center.model.js';

/**
 * Create event (Center Admin for their center, Super Admin for any center)
 */
export const createEvent = async (req, res, next) => {
  try {
    const { centerId, clubId, title, description, image, category, date, seats } = req.body;

    // Check if center exists
    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== centerId) {
        return res.status(403).json({
          success: false,
          message: 'You can only create events for your assigned center',
        });
      }
    }

    const event = new Event({
      centerId,
      clubId: clubId || undefined,
      title,
      description,
      image,
      category,
      date,
      seats: seats || 40,
      bookedCount: 0,
      createdBy: req.user._id,
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all events (optionally filter by center)
 */
export const getAllEvents = async (req, res, next) => {
  try {
    const { centerId } = req.query;
    const filter = {};
    if (centerId) filter.centerId = centerId;

    const events = await Event.find(filter)
      .populate('centerId', 'name wilaya commune')
      .populate('clubId', 'name category')
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single event
 */
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('centerId', 'name wilaya commune address')
      .populate('clubId', 'name category description')
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update event
 */
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== event.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update events for your assigned center',
        });
      }
    }

    const { title, description, image, category, date, seats } = req.body;

    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (image !== undefined) event.image = image;
    if (category) event.category = category;
    if (date) event.date = date;
    if (seats) event.seats = seats;

    await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== event.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete events for your assigned center',
        });
      }
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get events for center admin's managed center
 */
export const getMyEvents = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'center_admin') {
      if (!req.user.managedCenterId) {
        return res.json({
          success: true,
          data: { events: [] },
        });
      }
      filter.centerId = req.user.managedCenterId;
    }

    const events = await Event.find(filter)
      .populate('centerId', 'name')
      .populate('createdBy', 'name')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};
