import ExperienceCard from '../models/experienceCard.model.js';

export const createCard = async (req, res, next) => {
  try {
    const { title, host, summary, lessons, tag, centerId, sessionId } = req.body;

    if (!title || !host || !summary) {
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

    const card = await ExperienceCard.create({
      title,
      host,
      summary,
      lessons: lessons || [],
      tag,
      centerId,
      sessionId: sessionId || null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { card },
    });
  } catch (err) {
    next(err);
  }
};

export const listCards = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.centerId) filter.centerId = req.query.centerId;
    if (req.query.tag) filter.tag = req.query.tag;
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;

    const cards = await ExperienceCard.find(filter)
      .populate('centerId', 'name')
      .populate('createdBy', 'name')
      .populate('sessionId', 'title date')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cards.length,
      data: { cards },
    });
  } catch (err) {
    next(err);
  }
};

export const getCard = async (req, res, next) => {
  try {
    const card = await ExperienceCard.findById(req.params.id)
      .populate('centerId', 'name')
      .populate('createdBy', 'name')
      .populate('sessionId', 'title date');

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    res.json({
      success: true,
      data: { card },
    });
  } catch (err) {
    next(err);
  }
};
