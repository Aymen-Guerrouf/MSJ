import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Club from '../models/club.model.js'
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

export const getAdminDashboard = async(req,res,next)=>{
  try {
    const userCount = await User.find({role : 'user'}, {_id :0 , createdAt :1 , });
    const eventCount = await Event.find({centerId : req.user.managedCenterId});
    const clubcount = await Club.find({centerId : req.user.managedCenterId});

    return res.status(200).json({
      userCount,
      eventCount,
      clubcount,
      
    })
  } catch (error) {
    console.log(error);
    
  }
}

export const getSuperAdminDashboard = async (req,res,next)=>{
  try {
    const userscount = await User.find({role : 'user'})
    const centerscount = await centerModel.find()
    const clubscount = await Club.find()
    const eventscount = await Event.find()

    return res.status(200).json({
      userscount,
      centerscount,
      clubscount,
      eventscount
    })
  } catch (error) {
    console.log(error);
    
  }
}
