import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'activityType',
    },
    activityType: {
      type: String,
      required: true,
      enum: ['Event', 'Workshop'],
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to prevent duplicate registrations
participationSchema.index({ userId: 1, activityId: 1 }, { unique: true });

export default mongoose.model('Participation', participationSchema);
