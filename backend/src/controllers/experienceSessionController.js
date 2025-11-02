import ExperienceSession from '../models/experienceSession.model.js';

export const createSession = async (req, res, next) => {
  try {
    const { title, host, description, date, time, tag } = req.body;

    if (!title || !host || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Get centerId from user's managedCenterId or from request body
    let centerId = req.body.centerId;
    if (req.user.role === 'center_admin') {
      if (!req.user.managedCenterId) {
        return res.status(403).json({
          success: false,
          message: 'Center admin must have a managed center',
        });
      }
      centerId = req.user.managedCenterId;
    }

    if (!centerId) {
      return res.status(400).json({
        success: false,
        message: 'Center ID is required',
      });
    }

    const session = await ExperienceSession.create({
      title,
      host,
      description,
      date,
      time,
      tag,
      centerId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

export const listSessions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.centerId) filter.centerId = req.query.centerId;
    if (req.query.tag) filter.tag = req.query.tag;

    const sessions = await ExperienceSession.find(filter)
      .populate('centerId', 'name')
      .populate('createdBy', 'name')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: sessions.length,
      data: { sessions },
    });
  } catch (err) {
    next(err);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await ExperienceSession.findById(req.params.id)
      .populate('centerId', 'name')
      .populate('createdBy', 'name');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: { session },
    });
  } catch (err) {
    next(err);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const session = await ExperienceSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Check authorization
    if (req.user.role === 'center_admin') {
      if (!req.user.managedCenterId) {
        return res.status(403).json({
          success: false,
          message: 'Center admin must have a managed center',
        });
      }
      if (req.user.managedCenterId.toString() !== session.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this session',
        });
      }
    }

    const { title, description, date, time, tag } = req.body;

    if (title) session.title = title;
    if (description) session.description = description;
    if (date) session.date = date;
    if (time) session.time = time;
    if (tag) session.tag = tag;

    await session.save();

    res.json({
      success: true,
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    const session = await ExperienceSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Check authorization
    if (req.user.role === 'center_admin') {
      if (!req.user.managedCenterId) {
        return res.status(403).json({
          success: false,
          message: 'Center admin must have a managed center',
        });
      }
      if (req.user.managedCenterId.toString() !== session.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this session',
        });
      }
    }

    await session.deleteOne();

    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
