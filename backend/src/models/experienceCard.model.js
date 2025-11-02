import mongoose from 'mongoose';

const ExperienceCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  host: { type: String, required: true },
  summary: { type: String, required: true, maxlength: 800 },
  fullStory: { type: String, maxlength: 10000 },
  lessons: [{ type: String }],
  tag: { type: String },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceSession', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ExperienceCard', ExperienceCardSchema);
