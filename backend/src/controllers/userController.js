import User from '../models/user.model.js';
import { client, rqs } from '../services/recombeeClient.js';
import { getRecommendations } from '../services/recommendationService.js';

export const getHomeInfo = async (req, res) => {
  const userId = req.user._id.toString();

  try {
    const recommendedIds = await getRecommendations(userId, 5);
    res.json({ recommendedActivities: recommendedIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

export const updateUserInfo = async (req, res, next) => {
  //get the updated Data from the request
  const updatedData = req.body;
  console.log(updatedData);

  //update the use document
  const user = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });

  console.log(user);

  return res.status(204).json({
    success: true,
    message: 'user info updated',
  });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.status(204).json({
    success: true,
  });
};
