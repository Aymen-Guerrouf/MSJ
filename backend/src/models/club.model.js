import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Center',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    memberIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Club', clubSchema);
