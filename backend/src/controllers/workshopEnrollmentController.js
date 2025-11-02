import WorkshopEnrollment from '../models/workshopEnrollment.model.js';
import Workshop from '../models/workshop.model.js';

/**
 * Enroll in a workshop
 */
export const enrollInWorkshop = async (req, res, next) => {
  try {
    const { workshopId } = req.body;

    // Validate workshop exists
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    // Check if workshop is open
    if (workshop.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Workshop enrollment is closed',
      });
    }

    // Check if user already enrolled (unique index will also catch this)
    const existingEnrollment = await WorkshopEnrollment.findOne({
      userId: req.user._id,
      workshopId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this workshop',
      });
    }

    // Create enrollment - instant join using authenticated user's data
    const enrollment = await WorkshopEnrollment.create({
      userId: req.user._id,
      workshopId,
      fullName: req.user.name,
      phone: req.user.phone || '0000000000',
      age: req.user.age,
      paymentStatus: workshop.price > 0 ? 'pending' : 'paid',
    });

    const populatedEnrollment = await WorkshopEnrollment.findById(enrollment._id)
      .populate('workshopId', 'title date category price centerId mentorId')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message:
        workshop.price > 0
          ? 'Enrollment created. Please complete payment.'
          : 'Successfully enrolled in workshop',
      data: { enrollment: populatedEnrollment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all workshop enrollments (Admin)
 */
export const getAllWorkshopEnrollments = async (req, res, next) => {
  try {
    const { workshopId, userId, paymentStatus } = req.query;

    const filter = {};
    if (workshopId) filter.workshopId = workshopId;
    if (userId) filter.userId = userId;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Center admin can only see enrollments for their center's workshops
    if (req.user.role === 'center_admin') {
      const workshops = await Workshop.find({ centerId: req.user.managedCenterId }).select('_id');
      const workshopIds = workshops.map((w) => w._id);
      filter.workshopId = { $in: workshopIds };
    }

    const enrollments = await WorkshopEnrollment.find(filter)
      .populate('userId', 'name email')
      .populate('workshopId', 'title date category price centerId mentorId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: { enrollments },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my workshop enrollments
 */
export const getMyWorkshopEnrollments = async (req, res, next) => {
  try {
    const enrollments = await WorkshopEnrollment.find({ userId: req.user._id })
      .populate('workshopId', 'title date category price image centerId status mentorId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: { enrollments },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update payment status (Admin only)
 */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    if (!['pending', 'paid', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const enrollment = await WorkshopEnrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    enrollment.paymentStatus = paymentStatus;

    await enrollment.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: { enrollment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel workshop enrollment (Remove enrollment)
 */
export const cancelWorkshopEnrollment = async (req, res, next) => {
  try {
    const enrollment = await WorkshopEnrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Only the user who enrolled can cancel
    if (enrollment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own enrollments',
      });
    }

    // Delete the enrollment
    await WorkshopEnrollment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Enrollment cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete workshop enrollment (Admin only)
 */
export const deleteWorkshopEnrollment = async (req, res, next) => {
  try {
    const enrollment = await WorkshopEnrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    await WorkshopEnrollment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Enrollment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
