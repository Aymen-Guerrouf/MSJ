import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Center',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      default: '',
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      enum: ['announcement', 'news', 'gallery', 'update'],
      default: 'news',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
