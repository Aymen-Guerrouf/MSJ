import VirtualSchoolVideo from '../models/virtualSchoolVideo.model.js';

export const createVideo = async (req, res, next) => {
  try {
    const { title, category, description, videoUrl, thumbnailUrl, duration, centerId } = req.body;

    if (!title || !category || !videoUrl || !centerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    if (
      req.user.role === 'center_admin' &&
      req.user.managedCenterId.toString() !== centerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this center',
      });
    }

    const video = await VirtualSchoolVideo.create({
      title,
      category,
      description,
      videoUrl,
      thumbnailUrl: thumbnailUrl || null,
      duration,
      centerId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { video },
    });
  } catch (err) {
    next(err);
  }
};

export const listVideos = async (req, res, next) => {
  try {
    const { category, centerId } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (centerId) filter.centerId = centerId;

    const videos = await VirtualSchoolVideo.find(filter)
      .populate('centerId', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({
      success: true,
      count: videos.length,
      data: { videos },
    });
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await VirtualSchoolVideo.findById(req.params.id)
      .populate('centerId', 'name')
      .populate('createdBy', 'name');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json({
      success: true,
      data: { video },
    });
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await VirtualSchoolVideo.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    if (
      req.user.role === 'center_admin' &&
      req.user.managedCenterId.toString() !== video.centerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const { title, category, description, videoUrl, thumbnailUrl, duration } = req.body;

    if (title) video.title = title;
    if (category) video.category = category;
    if (description !== undefined) video.description = description;
    if (videoUrl) video.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
    if (duration) video.duration = duration;

    await video.save();

    res.json({
      success: true,
      data: { video },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await VirtualSchoolVideo.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    if (
      req.user.role === 'center_admin' &&
      req.user.managedCenterId.toString() !== video.centerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await VirtualSchoolVideo.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
