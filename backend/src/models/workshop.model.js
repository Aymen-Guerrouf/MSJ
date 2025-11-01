import mongoose from 'mongoose';
const { Schema } = mongoose;

const WORKSHOP_CATEGORIES = [
  'tech',
  'arts',
  'language',
  'skills',
  'health',
  'business',
  'science',
  'other',
];

const workshopSchema = new Schema(
  {
    centerId: {
      type: Schema.Types.ObjectId,
      ref: 'Center',
      required: true,
    },
    clubId: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: WORKSHOP_CATEGORIES,
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    image: {
      type: String,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
      default: 40,
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual for available seats
workshopSchema.virtual('availableSeats').get(function () {
  return this.seats - this.bookedCount;
});

// Ensure we can't overbook
workshopSchema.pre('save', function (next) {
  if (this.bookedCount > this.seats) {
    next(new Error('Cannot book more seats than available'));
  }
  next();
});

export default mongoose.model('Workshop', workshopSchema);
