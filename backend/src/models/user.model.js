import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    age: {
      type: Number,
      required: function () {
        return this.role !== 'admin'; // Age not required for admins
      },
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age must be less than 120'],
    },
    interests: [
      {
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
          'design',
          'other',
        ],
      },
    ],
    // Token version for refresh token rotation - increment to invalidate all tokens
    tokenVersion: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['user', 'center_admin', 'super_admin'],
      default: 'user',
    },
    isMentor: {
      type: Boolean,
      default: false,
    },
    mentorBio: {
      type: String,
      default: null,
      maxlength: [500, 'Mentor bio cannot exceed 500 characters'],
    },
    mentorExpertise: [
      {
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
      },
    ],
    // For center admins - which center they manage
    managedCenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Center',
      default: null,
    },
    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    // Password reset fields
    resetPasswordCode: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    createdAt: {
      type: Date,
      default : Date.now()
      },
  },
  {
    timestamps: true,
  }
);

// Create index on email for faster lookups
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment token version (invalidates all existing tokens)
userSchema.methods.incrementTokenVersion = async function () {
  this.tokenVersion += 1;
  return this.save();
};

// Method to create password reset code (6-digit)
userSchema.methods.createPasswordResetCode = function () {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash code and save to database
  this.resetPasswordCode = crypto.createHash('sha256').update(resetCode).digest('hex');

  // Set expiry (10 minutes)
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  // Return unhashed code (to send in email)
  return resetCode;
};

// Method to create email verification code (6-digit)
userSchema.methods.createEmailVerificationCode = function () {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash code and save to database
  this.emailVerificationCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

  // Set expiry (24 hours)
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  // Return unhashed code (to send in email)
  return verificationCode;
};

// Virtual populate for user's club memberships
userSchema.virtual('myClubs', {
  ref: 'ClubMembership',
  localField: '_id',
  foreignField: 'userId',
});

// Virtual populate for user's event registrations
userSchema.virtual('myEvents', {
  ref: 'EventRegistration',
  localField: '_id',
  foreignField: 'userId',
});

// Virtual populate for user's workshop enrollments
userSchema.virtual('myWorkshops', {
  ref: 'WorkshopEnrollment',
  localField: '_id',
  foreignField: 'userId',
});

// Virtual populate for user's startup ideas
userSchema.virtual('myStartupIdeas', {
  ref: 'StartupIdea',
  localField: '_id',
  foreignField: 'owner',
});

// Virtual populate for mentorship requests (as mentor)
userSchema.virtual('mentorshipRequests', {
  ref: 'MentorshipRequest',
  localField: '_id',
  foreignField: 'mentor',
});

// Virtual populate for mentorship requests (as mentee)
userSchema.virtual('myMentorshipRequests', {
  ref: 'MentorshipRequest',
  localField: '_id',
  foreignField: 'mentee',
});

// Enable virtuals in toJSON and toObject
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.tokenVersion;
  delete obj.resetPasswordCode;
  delete obj.resetPasswordExpires;
  delete obj.emailVerificationCode;
  delete obj.emailVerificationExpires;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
