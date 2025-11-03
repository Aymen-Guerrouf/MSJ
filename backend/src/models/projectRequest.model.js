// models/projectRequest.model.js

import mongoose from 'mongoose';

const projectRequestSchema = new mongoose.Schema(
  {
    /**
     * The supervisor (a User) being requested.
     */
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    /**
     * The entrepreneur (a User) making the request.
     */
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    /**
     * The project (a StartupIdea) being submitted.
     */
    startupIdea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupIdea',
      required: true,
    },
    /**
     * The status of this specific request.
     */
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * INDEX: Enforces "one pending request at a time" rule.
 * An entrepreneur (user) can only have ONE request with a 'pending' status.
 * This is the core logic you requested.
 */
projectRequestSchema.index(
  { entrepreneur: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'pending' },
    message: 'You already have a pending request. You can only send one at a time.',
  }
);

/**
 * Index for fast lookups of a supervisor's pending requests.
 * (For the "Supervisor Dashboard")
 */
projectRequestSchema.index({ supervisor: 1, status: 1 });

const ProjectRequest = mongoose.model('ProjectRequest', projectRequestSchema);

export default ProjectRequest;
