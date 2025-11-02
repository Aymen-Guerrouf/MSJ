import mongoose from 'mongoose';

const workshopEnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
    },
    fullName: {
      type: String,
      required: false, // Auto-populated from user
    },
    phone: {
      type: String,
      required: false, // Auto-populated from user
    },
    age: {
      type: Number,
      required: false, // Auto-populated from user
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to prevent duplicate enrollments
workshopEnrollmentSchema.index({ userId: 1, workshopId: 1 }, { unique: true });

export default mongoose.model('WorkshopEnrollment', workshopEnrollmentSchema);
