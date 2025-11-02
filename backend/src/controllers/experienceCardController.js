import ExperienceCard from '../models/experienceCard.model.js';

export const createCard = async (req, res, next) => {
  try {
    const { title, host, summary, lessons, tag, sessionId } = req.body;

    if (!title || !host || !summary) {
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
      data: card,
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

export const updateCard = async (req, res, next) => {
  try {
    const card = await ExperienceCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
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
      if (req.user.managedCenterId.toString() !== card.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this card',
        });
      }
    }

    const { title, summary, lessons, tag, sessionId, host } = req.body;

    if (title) card.title = title;
    if (host) card.host = host;
    if (summary) card.summary = summary;
    if (lessons) card.lessons = lessons;
    if (tag) card.tag = tag;
    if (sessionId !== undefined) card.sessionId = sessionId;

    await card.save();

    res.json({
      success: true,
      data: card,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const card = await ExperienceCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
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
      if (req.user.managedCenterId.toString() !== card.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this card',
        });
      }
    }

    await card.deleteOne();

    res.json({
      success: true,
      message: 'Card deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
