import mongoose from 'mongoose';
const { Schema } = mongoose;

const CATEGORIES = {
  event: [
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
  ],
  workshop: ['tech', 'arts', 'language', 'skills', 'health', 'business', 'science', 'other'],
};

const activitySchema = new Schema(
  {
    centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true },
    // use 'kind' to differentiate documents
    kind: { type: String, enum: ['event', 'workshop'], required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // Changed from startDate to date to match eventController
    date: { type: Date, required: true },

    // categories limited per kind
    category: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const allowed = CATEGORIES[this.kind] || [];
          return allowed.includes(v);
        },
        message: (props) => `Invalid category '${props.value}' for kind '${props.instance.kind}'`,
      },
    },

    // mentor required for workshops only
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.kind === 'workshop';
      },
    },

    // price in DZD (applicable for workshops only, 0 = free)
    price: {
      type: Number,
      min: 0,
      default: 0,
      validate: {
        validator: function (v) {
          // Price is only validated for workshops
          if (this.kind === 'workshop') {
            return v !== null && v !== undefined && v >= 0;
          }
          // For events, price should not be set
          return true;
        },
        message: 'Workshop price must be a non-negative number (0 for free)',
      },
    },

    image: { type: String },

    // Changed from capacity to seats to match eventController
    seats: { type: Number, required: true, min: 1, default: 40 },

    // Track bookings
    bookedCount: { type: Number, default: 0, min: 0 },

    // two-state status
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
activitySchema.virtual('availableSeats').get(function () {
  return this.seats - this.bookedCount;
});

// Ensure we can't overbook
activitySchema.pre('save', function (next) {
  if (this.bookedCount > this.seats) {
    next(new Error('Cannot book more seats than available'));
  }
  next();
});

export default mongoose.model('Activity', activitySchema);
