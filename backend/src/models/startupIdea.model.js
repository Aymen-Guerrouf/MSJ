import mongoose from 'mongoose';
const { Schema } = mongoose;

const STARTUP_CATEGORIES = [
  'football',
  'basketball',
  'volleyball',
  'chess',
  'arts',
  'music',
  'theatre',
  'coding',
  'gaming',
  'education',
  'volunteering',
  'culture',
  'tech',
  'health',
  'entrepreneurship',
  'design',
  'marketing',
  'other',
];

const startupIdeaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Startup title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: STARTUP_CATEGORIES,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    center: {
      type: Schema.Types.ObjectId,
      ref: 'Center',
      required: [true, 'Center is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    isSupported: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for progress snaps
startupIdeaSchema.virtual('progressSnaps', {
  ref: 'ProgressSnap',
  localField: '_id',
  foreignField: 'startupIdea',
  options: { sort: { createdAt: -1 } },
});

// Index for efficient queries
startupIdeaSchema.index({ owner: 1, center: 1 });
startupIdeaSchema.index({ category: 1, status: 1 });
startupIdeaSchema.index({ isSupported: 1, status: 1 });

export default mongoose.model('StartupIdea', startupIdeaSchema);
