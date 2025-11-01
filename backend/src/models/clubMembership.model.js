import mongoose from 'mongoose';

const clubMembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'leader'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to prevent duplicate memberships
clubMembershipSchema.index({ userId: 1, clubId: 1 }, { unique: true });

export default mongoose.model('ClubMembership', clubMembershipSchema);
