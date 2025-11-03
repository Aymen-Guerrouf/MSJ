// models/startupIdea.model.js

import mongoose from 'mongoose';

const startupIdeaSchema = new mongoose.Schema(
  {
    // --- Basic Info ---
    title: {
      type: String,
      required: [true, 'A project title is required.'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters.'],
    },
    // The "elevator pitch"
    description: {
      type: String,
      required: [true, 'A brief description is required.'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters.'],
    },
    category: {
      type: String,
      required: [true, 'Please select a primary category.'],
      enum: [
        'Technology',
        'Education',
        'Healthcare',
        'Environment',
        'Innovation',
        'AI',
        'Mobile',
        'Web',
        'Social Impact',
        'Business',
        'Design',
        'Science',
      ],
    },
    images: [
      {
        type: String, // URLs from Cloudinary
        validate: [(v) => /^https?:\/\//.test(v), 'Invalid image URL.'],
      },
    ],

    // --- Professional Details (NEW) ---
    problemStatement: {
      type: String,
      required: [true, 'Please describe the problem you are solving.'],
      trim: true,
      maxlength: [1000, 'Problem statement cannot exceed 1000 characters.'],
    },
    solution: {
      type: String,
      required: [true, 'Please describe your solution.'],
      trim: true,
      maxlength: [1000, 'Solution description cannot exceed 1000 characters.'],
    },
    targetMarket: {
      type: String,
      required: [true, 'Please describe your target customers.'],
      trim: true,
      maxlength: [500, 'Target market description cannot exceed 500 characters.'],
    },
    businessModel: {
      type: String,
      required: [true, 'Please describe how your project will make money.'],
      trim: true,
      enum: [
        'SaaS (Subscription)',
        'E-commerce',
        'Marketplace',
        'Ad-Supported',
        'Hardware Sale',
        'Freemium',
        'Service-Based',
        'Not Sure Yet',
        'Other',
      ],
      default: 'Not Sure Yet',
    },

    // --- System Fields ---
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending', // The user is working on it (this is the new 'private')
        'pending_review', // The user has sent it to a supervisor
        'public', // Approved and on the Sparks Hub
      ],
      default: 'pending', // Default to 'pending'
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isSupported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Virtual Populate for Progress Updates ---
// This links to your `progressSnap.model.js`
startupIdeaSchema.virtual('progressUpdates', {
  ref: 'ProgressSnap',
  localField: '_id',
  foreignField: 'startupIdea',
  options: { sort: { createdAt: -1 } }, // Show newest updates first
});

// --- Indexes ---
startupIdeaSchema.index({ owner: 1, status: 1 }); // For "My Project"
startupIdeaSchema.index({ status: 1, category: 1 }); // For "Sparks Hub"
startupIdeaSchema.index({ supervisor: 1 }); // For Supervisor's dashboard

const StartupIdea = mongoose.model('StartupIdea', startupIdeaSchema);
export default StartupIdea;
