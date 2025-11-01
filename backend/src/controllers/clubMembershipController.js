import ClubMembership from '../models/clubMembership.model.js';
import Club from '../models/club.model.js';

/**
 * Join a club
 */
export const joinClub = async (req, res, next) => {
  try {
    const { clubId } = req.body;

    // Validate club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    // Check if user is already a member (unique index will also catch this)
    const existingMembership = await ClubMembership.findOne({
      userId: req.user._id,
      clubId,
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this club',
      });
    }

    // Create membership - instant join
    const membership = await ClubMembership.create({
      userId: req.user._id,
      clubId,
      role: 'member',
    });

    const populatedMembership = await ClubMembership.findById(membership._id)
      .populate('clubId', 'name category description centerId')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Successfully joined club',
      data: { membership: populatedMembership },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Leave a club (Remove membership)
 */
export const leaveClub = async (req, res, next) => {
  try {
    const { clubId } = req.params;

    const membership = await ClubMembership.findOne({
      userId: req.user._id,
      clubId,
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
    }

    // Delete the membership
    await ClubMembership.findByIdAndDelete(membership._id);

    res.json({
      success: true,
      message: 'Successfully left club',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all club memberships (Admin)
 */
export const getAllClubMemberships = async (req, res, next) => {
  try {
    const { clubId, userId, role } = req.query;

    const filter = {};
    if (clubId) filter.clubId = clubId;
    if (userId) filter.userId = userId;
    if (role) filter.role = role;

    // Center admin can only see memberships for their center's clubs
    if (req.user.role === 'center_admin') {
      const clubs = await Club.find({ centerId: req.user.managedCenterId }).select('_id');
      const clubIds = clubs.map((c) => c._id);
      filter.clubId = { $in: clubIds };
    }

    const memberships = await ClubMembership.find(filter)
      .populate('userId', 'name email age')
      .populate('clubId', 'name category centerId')
      .sort({ joinedAt: -1 });

    res.json({
      success: true,
      count: memberships.length,
      data: { memberships },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my club memberships
 */
export const getMyClubMemberships = async (req, res, next) => {
  try {
    const memberships = await ClubMembership.find({
      userId: req.user._id,
    })
      .populate('clubId', 'name category description images centerId')
      .sort({ joinedAt: -1 });

    res.json({
      success: true,
      count: memberships.length,
      data: { memberships },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get members of a club
 */
export const getClubMembers = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const { role } = req.query;

    const filter = { clubId };
    if (role) filter.role = role;

    const memberships = await ClubMembership.find(filter)
      .populate('userId', 'name email age')
      .sort({ joinedAt: -1 });

    res.json({
      success: true,
      count: memberships.length,
      data: { members: memberships },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update member role (Admin/Leader only)
 */
export const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!['member', 'moderator', 'leader'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const membership = await ClubMembership.findById(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
    }

    membership.role = role;
    await membership.save();

    const populatedMembership = await ClubMembership.findById(membership._id)
      .populate('userId', 'name email')
      .populate('clubId', 'name category');

    res.json({
      success: true,
      message: 'Member role updated successfully',
      data: { membership: populatedMembership },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from club (Admin only)
 */
export const removeMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const membership = await ClubMembership.findById(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found',
      });
    }

    await ClubMembership.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Member removed from club successfully',
    });
  } catch (error) {
    next(error);
  }
};
