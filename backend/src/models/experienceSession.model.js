import mongoose from 'mongoose';

const ExperienceSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  tag: { type: String },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ExperienceSession', ExperienceSessionSchema);
