import mongoose from 'mongoose';

const VIRTUAL_SCHOOL_CATEGORIES = [
  'coding',
  'language',
  'career',
  'health',
  'entrepreneurship',
  'design',
  'marketing',
  'other',
];

const VirtualSchoolVideoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: VIRTUAL_SCHOOL_CATEGORIES,
  },
  description: { type: String, trim: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: null },

  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('VirtualSchoolVideo', VirtualSchoolVideoSchema);
