import Center from '../models/center.model.js';
import User from '../models/user.model.js';

/**
 * Create a new center (Super Admin only)
 */
export const createCenter = async (req, res, next) => {
  try {
    const { name, wilaya, commune, address, phone, email, images, coordinates } = req.body;

    const center = new Center({
      name,
      wilaya,
      commune,
      address,
      phone,
      email,
      images: images || [],
      location: {
        type: 'Point',
        coordinates: coordinates, // [longitude, latitude]
      },
      managers: [],
    });

    await center.save();

    res.status(201).json({
      success: true,
      message: 'Center created successfully',
      data: { center },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all centers
 * Query params:
 * - include: comma-separated list of related data to include
 *   Supported values: clubs, events, workshops, all
 *   Example: ?include=clubs,events or ?include=all
 */
export const getAllCenters = async (req, res, next) => {
  try {
    const { include } = req.query;

    let query = Center.find().populate('adminIds', 'name email');

    // Parse include parameter
    if (include) {
      const includeList = include.split(',').map((item) => item.trim().toLowerCase());

      if (includeList.includes('all')) {
        // Include everything
        query = query.populate('clubs').populate('events').populate('workshops');
      } else {
        // Include specific relations
        if (includeList.includes('clubs')) {
          query = query.populate('clubs');
        }
        if (includeList.includes('events')) {
          query = query.populate('events');
        }
        if (includeList.includes('workshops')) {
          query = query.populate('workshops');
        }
      }
    }

    const centers = await query;

    res.json({
      success: true,
      data: { centers },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single center by ID
 * Query params:
 * - include: comma-separated list of related data to include
 *   Supported values: clubs, events, workshops, all
 *   Example: ?include=clubs,events or ?include=all
 */
export const getCenterById = async (req, res, next) => {
  try {
    const { include } = req.query;

    let query = Center.findById(req.params.id).populate('adminIds', 'name email');

    // Parse include parameter
    if (include) {
      const includeList = include.split(',').map((item) => item.trim().toLowerCase());

      if (includeList.includes('all')) {
        // Include everything
        query = query.populate('clubs').populate('events').populate('workshops');
      } else {
        // Include specific relations
        if (includeList.includes('clubs')) {
          query = query.populate('clubs');
        }
        if (includeList.includes('events')) {
          query = query.populate('events');
        }
        if (includeList.includes('workshops')) {
          query = query.populate('workshops');
        }
      }
    }

    const center = await query;

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found',
      });
    }

    res.json({
      success: true,
      data: { center },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update center (Super Admin or assigned Center Admin)
 */
export const updateCenter = async (req, res, next) => {
  try {
    const centerId = req.params.id;
    const center = await Center.findById(centerId);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      // Center admin can only update their assigned center
      if (req.user.managedCenterId?.toString() !== centerId) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your assigned center',
        });
      }
    }

    const { name, wilaya, commune, address, phone, email, images, coordinates } = req.body;

    // Update fields
    if (name) center.name = name;
    if (wilaya) center.wilaya = wilaya;
    if (commune) center.commune = commune;
    if (address) center.address = address;
    if (phone !== undefined) center.phone = phone;
    if (email !== undefined) center.email = email;
    if (images) center.images = images;
    if (coordinates) center.location.coordinates = coordinates;

    await center.save();

    res.json({
      success: true,
      message: 'Center updated successfully',
      data: { center },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete center (Super Admin only)
 */
export const deleteCenter = async (req, res, next) => {
  try {
    const center = await Center.findByIdAndDelete(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found',
      });
    }

    // Remove managedCenterId from all center admins
    await User.updateMany({ managedCenterId: req.params.id }, { managedCenterId: null });

    res.json({
      success: true,
      message: 'Center deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Assign center admin to a center (Super Admin only)
 */
export const assignCenterAdmin = async (req, res, next) => {
  try {
    const { centerId, userId } = req.body;

    // Check if center exists
    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found',
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update user role and assign center
    user.role = 'center_admin';
    user.managedCenterId = centerId;
    await user.save();

    // Add user to center's managers array if not already there
    if (!center.managers.includes(userId)) {
      center.managers.push(userId);
      await center.save();
    }

    res.json({
      success: true,
      message: 'Center admin assigned successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          managedCenterId: user.managedCenterId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove center admin from a center (Super Admin only)
 */
export const removeCenterAdmin = async (req, res, next) => {
  try {
    const { centerId, userId } = req.body;

    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove center admin role
    user.role = 'user';
    user.managedCenterId = null;
    await user.save();

    // Remove from center's managers array
    center.managers = center.managers.filter((id) => id.toString() !== userId);
    await center.save();

    res.json({
      success: true,
      message: 'Center admin removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get centers managed by current user (for center admins)
 */
export const getMyCenters = async (req, res, next) => {
  try {
    if (req.user.role === 'super_admin') {
      // Super admin can see all centers
      const centers = await Center.find();
      return res.json({
        success: true,
        data: { centers },
      });
    }

    if (req.user.role === 'center_admin' && req.user.managedCenterId) {
      const center = await Center.findById(req.user.managedCenterId);
      return res.json({
        success: true,
        data: { centers: center ? [center] : [] },
      });
    }

    res.json({
      success: true,
      data: { centers: [] },
    });
  } catch (error) {
    next(error);
  }
};
