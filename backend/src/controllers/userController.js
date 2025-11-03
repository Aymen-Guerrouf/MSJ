import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Club from '../models/club.model.js';
import { getRecommendations } from '../services/recommendationService.js';

export const getHomeInfo = async (req, res) => {
  const userId = req.user._id.toString();

  try {
    const recommendedIds = await getRecommendations(userId, 5);
    res.json({ recommendedActivities: recommendedIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  }


export const updateUserInfo = async (req, res) => {
  //get the updated Data from the request
  const updatedData = req.body;

  //update the use document
  await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });

  return res.status(204).json({
    success: true,
    message: 'user info updated',
  });
};

export const updateUserInterests = async (req, res) => {
  try {
    const { interests } = req.body;

    // Validate interests array
    if (!Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array',
      });
    }

    // Valid interest values from the schema
    const validInterests = [
      'football',
      'basketball',
      'volleyball',
      'chess',
      'arts',
      'music',
      'theatre',
      'coding',
      'gaming',
      'education',
      'volunteering',
      'culture',
      'tech',
      'health',
      'design',
      'other',
    ];

    // Check if all interests are valid
    const invalidInterests = interests.filter((i) => !validInterests.includes(i));
    if (invalidInterests.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid interests: ${invalidInterests.join(', ')}`,
        validInterests,
      });
    }

    // Update user interests
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { interests },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Interests updated successfully',
      data: {
        interests: updatedUser.interests,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update interests',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.status(204).json({
    success: true,
  });
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.find({ role: 'user' }, { _id: 0, createdAt: 1 });
    const eventCount = await Event.find({ centerId: req.user.managedCenterId });
    const clubcount = await Club.find({ centerId: req.user.managedCenterId });

    return res.status(200).json({
      userCount,
      eventCount,
      clubcount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard',
      error: error.message,
    });
  }
};

export const getSuperAdminDashboard = async (req, res) => {
  try {
    const userscount = await User.find({ role: 'user' });
    const centerscount = await centerModel.find();
    const clubscount = await Club.find();
    const eventscount = await Event.find();

    return res.status(200).json({
      userscount,
      centerscount,
      clubscount,
      eventscount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch super admin dashboard',
      error: error.message,
    });
  }
};
