import Club from '../models/club.model.js';
import Center from '../models/center.model.js';
import User from '../models/user.model.js';

/**
 * Create club (Center Admin for their center, Super Admin for any center)
 */
export const createClub = async (req, res, next) => {
  try {
    const { centerId, name, description, category, images } = req.body;

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
          message: 'You can only create clubs for your assigned center',
        });
      }
    }

    const club = new Club({
      centerId,
      name,
      description,
      category,
      images: images || [],
      createdBy: req.user._id,
      memberIds: [],
    });

    await club.save();

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all clubs (Public - with optional filters)
 */
export const getAllClubs = async (req, res, next) => {
  try {
    const { centerId, category } = req.query;

    const filter = {};
    if (centerId) filter.centerId = centerId;
    if (category) filter.category = category;

    const clubs = await Club.find(filter)
      .populate('centerId', 'name wilaya commune')
      .populate('createdBy', 'name')
      .populate('memberIds', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: { clubs },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single club by ID (Public)
 */
export const getClubById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const club = await Club.findById(id)
      .populate('centerId', 'name address wilaya commune phone email')
      .populate('createdBy', 'name')
      .populate('memberIds', 'name email');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update club (Center Admin for their center, Super Admin for any)
 */
export const updateClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== club.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update clubs for your assigned center',
        });
      }
    }

    // Don't allow updating createdBy or centerId
    delete updates.createdBy;
    delete updates.centerId;

    Object.assign(club, updates);
    await club.save();

    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete club (Center Admin for their center, Super Admin for any)
 */
export const deleteClub = async (req, res, next) => {
  try {
    const { id } = req.params;

    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== club.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete clubs for your assigned center',
        });
      }
    }

    await Club.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Club deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get clubs for center admin's center
 */
export const getMyClubs = async (req, res, next) => {
  try {
    if (req.user.role !== 'center_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only center admins can use this endpoint',
      });
    }

    const clubs = await Club.find({ centerId: req.user.managedCenterId })
      .populate('createdBy', 'name')
      .populate('memberIds', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: { clubs },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to club (Authenticated users can join)
 */
export const addMemberToClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Determine which user to add
    const userIdToAdd = userId || req.user._id.toString();

    // Only admins can add other users
    if (userId && req.user.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'You can only add yourself to clubs',
      });
    }

    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Center admins can only add members to their center's clubs
    if (
      req.user.role === 'center_admin' &&
      club.centerId.toString() !== req.user.managedCenterId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only add members to clubs in your center',
      });
    }

    // Check if user exists
    const user = await User.findById(userIdToAdd);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already a member
    if (club.memberIds.includes(userIdToAdd)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this club',
      });
    }

    club.memberIds.push(userIdToAdd);
    await club.save();

    res.status(200).json({
      success: true,
      message: 'Member added to club successfully',
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from club (User can leave, admins can remove any)
 */
export const removeMemberFromClub = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Users can only remove themselves
    if (req.user.role === 'user' && userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only remove yourself from clubs',
      });
    }

    // Center admins can only remove members from their center's clubs
    if (
      req.user.role === 'center_admin' &&
      club.centerId.toString() !== req.user.managedCenterId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only remove members from clubs in your center',
      });
    }

    // Check if user is a member
    if (!club.memberIds.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is not a member of this club',
      });
    }

    club.memberIds = club.memberIds.filter((id) => id.toString() !== userId);
    await club.save();

    res.status(200).json({
      success: true,
      message: 'Member removed from club successfully',
      data: { club },
    });
  } catch (error) {
    next(error);
  }
};
