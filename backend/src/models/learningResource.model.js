import mongoose from 'mongoose';
const { Schema } = mongoose;

const RESOURCE_CATEGORIES = [
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

const learningResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
    },
    description: {
      type: String,
      default: null,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: RESOURCE_CATEGORIES,
      index: true,
    },
    center: {
      type: Schema.Types.ObjectId,
      ref: 'Center',
      required: [true, 'Center is required'],
      index: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin user is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
learningResourceSchema.index({ category: 1, center: 1 });
learningResourceSchema.index({ center: 1, createdAt: -1 });

export default mongoose.model('LearningResource', learningResourceSchema);
