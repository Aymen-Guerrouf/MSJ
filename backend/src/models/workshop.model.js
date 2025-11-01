import mongoose from 'mongoose';
const { Schema } = mongoose;

const WORKSHOP_CATEGORIES = [
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
  'other',
];

const workshopSchema = new Schema(
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
      enum: WORKSHOP_CATEGORIES,
    },
    mentorId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
    image: {
      type: String,
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

export default mongoose.model('Workshop', workshopSchema);
