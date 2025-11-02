import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
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
  },
  {
    timestamps: true,
  }
);

// Create compound index to prevent duplicate registrations
eventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export default mongoose.model('EventRegistration', eventRegistrationSchema);
