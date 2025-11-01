import ExperienceSession from '../models/experienceSession.model.js';

export const createSession = async (req, res, next) => {
  try {
    const { title, description, date, time, tag, centerId } = req.body;

    if (!title || !date || !time || !centerId) {
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

    const session = await ExperienceSession.create({
      title,
      description,
      date,
      time,
      tag,
      centerId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { session },
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
