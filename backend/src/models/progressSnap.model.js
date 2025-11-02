import mongoose from 'mongoose';
const { Schema } = mongoose;

const progressSnapSchema = new Schema(
  {
    startupIdea: {
      type: Schema.Types.ObjectId,
      ref: 'StartupIdea',
      required: [true, 'Startup idea reference is required'],
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Progress update text is required'],
      maxlength: [1000, 'Progress update cannot exceed 1000 characters'],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
progressSnapSchema.index({ startupIdea: 1, createdAt: -1 });
progressSnapSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model('ProgressSnap', progressSnapSchema);
