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
  'entrepreneurship',
  'design',
  'marketing',
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
    participantIds : {
      type : [Schema.Types.ObjectId],
      ref : 'User',
      default : []
    }
  },
  { timestamps: true }
);

// Add indexes for better query performance
eventSchema.index({ centerId: 1, date: -1 }); // Most common query
eventSchema.index({ category: 1, date: -1 }); // Filter by category
eventSchema.index({ status: 1, date: -1 }); // Filter by status

export default mongoose.model('Event', eventSchema);
