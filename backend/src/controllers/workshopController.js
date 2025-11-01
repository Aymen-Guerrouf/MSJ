import Workshop from '../models/workshop.model.js';
import Center from '../models/center.model.js';
import User from '../models/user.model.js';

/**
 * Create workshop (Center Admin for their center, Super Admin for any center)
 */
export const createWorkshop = async (req, res, next) => {
  try {
    const { centerId, clubId, title, description, image, category, date, seats, mentorId, price } =
      req.body;

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
          message: 'You can only create workshops for your assigned center',
        });
      }
    }

    // Validate mentor exists
    if (mentorId) {
      const mentor = await User.findById(mentorId);
      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: 'Mentor not found',
        });
      }
    }

    const workshop = new Workshop({
      centerId,
      clubId: clubId || undefined,
      title,
      description,
      image,
      category,
      date,
      seats: seats || 40,
      bookedCount: 0,
      mentorId,
      price: price !== undefined ? price : 0,
      createdBy: req.user._id,
    });

    await workshop.save();

    res.status(201).json({
      success: true,
      message: 'Workshop created successfully',
      data: { workshop },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all workshops (Public - with optional filters)
 */
export const getAllWorkshops = async (req, res, next) => {
  try {
    const { centerId, category, status } = req.query;

    const filter = {};
    if (centerId) filter.centerId = centerId;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const workshops = await Workshop.find(filter)
      .populate('centerId', 'name wilaya commune')
      .populate('clubId', 'name category')
      .populate('mentorId', 'name email')
      .populate('createdBy', 'name')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: workshops.length,
      data: { workshops },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single workshop by ID (Public)
 */
export const getWorkshopById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findById(id)
      .populate('centerId', 'name address wilaya commune phone email')
      .populate('clubId', 'name category description')
      .populate('mentorId', 'name email')
      .populate('createdBy', 'name');

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { workshop },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update workshop (Center Admin for their center, Super Admin for any)
 */
export const updateWorkshop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const workshop = await Workshop.findById(id);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== workshop.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update workshops for your assigned center',
        });
      }
    }

    // Prevent changing kind
    delete updates.kind;

    // If mentorId is being updated, validate it exists
    if (updates.mentorId) {
      const mentor = await User.findById(updates.mentorId);
      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: 'Mentor not found',
        });
      }
    }

    Object.assign(workshop, updates);
    await workshop.save();

    res.status(200).json({
      success: true,
      message: 'Workshop updated successfully',
      data: { workshop },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete workshop (Center Admin for their center, Super Admin for any)
 */
export const deleteWorkshop = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findById(id);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== workshop.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete workshops for your assigned center',
        });
      }
    }

    await Workshop.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Workshop deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get workshops for center admin's center
 */
export const getMyWorkshops = async (req, res, next) => {
  try {
    if (req.user.role !== 'center_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only center admins can use this endpoint',
      });
    }

    const workshops = await Workshop.find({
      centerId: req.user.managedCenterId,
    })
      .populate('mentorId', 'name email')
      .populate('createdBy', 'name')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: workshops.length,
      data: { workshops },
    });
  } catch (error) {
    next(error);
  }
};
