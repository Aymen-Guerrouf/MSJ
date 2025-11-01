import mongoose from 'mongoose';
const { Schema } = mongoose;

const EVENT_CATEGORIES = [
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

const eventSchema = new Schema(
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
      enum: EVENT_CATEGORIES,
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

export default mongoose.model('Event', eventSchema);
