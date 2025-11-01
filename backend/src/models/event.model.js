import mongoose from 'mongoose';
const { Schema } = mongoose;

const EVENT_CATEGORIES = [
  'sports',
  'art',
  'coding',
  'music',
  'theatre',
  'gaming',
  'education',
  'volunteering',
  'chess',
  'other',
];

const eventSchema = new Schema(
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
      enum: EVENT_CATEGORIES,
    },
    image: {
      type: String,
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
eventSchema.virtual('availableSeats').get(function () {
  return this.seats - this.bookedCount;
});

// Ensure we can't overbook
eventSchema.pre('save', function (next) {
  if (this.bookedCount > this.seats) {
    next(new Error('Cannot book more seats than available'));
  }
  next();
});

export default mongoose.model('Event', eventSchema);
