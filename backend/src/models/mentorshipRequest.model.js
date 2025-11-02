import mongoose from 'mongoose';
const { Schema } = mongoose;

const mentorshipRequestSchema = new Schema(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mentor is required'],
      index: true,
    },
    mentee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mentee is required'],
      index: true,
    },
    startupIdea: {
      type: Schema.Types.ObjectId,
      ref: 'StartupIdea',
      default: null,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Request message is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
mentorshipRequestSchema.index({ mentor: 1, status: 1 });
mentorshipRequestSchema.index({ mentee: 1, status: 1 });
mentorshipRequestSchema.index({ mentor: 1, mentee: 1 });

// Prevent duplicate pending requests from same mentee to same mentor
mentorshipRequestSchema.index(
  { mentor: 1, mentee: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'pending' },
  }
);

export default mongoose.model('MentorshipRequest', mentorshipRequestSchema);
