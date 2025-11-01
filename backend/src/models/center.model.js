import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    wilaya: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    hasTour: {
      type: Boolean,
      default: false,
    },

    latitude: {
      type: Number,
      required: false,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: false,
      min: -180,
      max: 180,
    },
    images: [
      {
        type: String,
      },
    ],
    adminIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add index for geospatial queries
centerSchema.index({ latitude: 1, longitude: 1 });

// Virtual populate for clubs
centerSchema.virtual('clubs', {
  ref: 'Club',
  localField: '_id',
  foreignField: 'centerId',
});

// Virtual populate for events only
centerSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'centerId',
});

// Virtual populate for workshops only
centerSchema.virtual('workshops', {
  ref: 'Workshop',
  localField: '_id',
  foreignField: 'centerId',
});

export default mongoose.model('Center', centerSchema);
