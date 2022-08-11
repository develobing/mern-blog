const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const crypto = require('crypto');

// Create Shchema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },

    profilePhoto: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },

    bio: {
      type: String,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    postCount: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ['Admin', 'Guest', 'Blogger'],
      default: 'Guest',
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isFollowing: {
      type: Boolean,
      default: false,
    },

    isUnFollowing: {
      type: Boolean,
      default: false,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,

    active: {
      type: Boolean,
      default: true,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
  }
});

// Match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

// Verify account
userSchema.methods.createVerificationToken = async function () {
  // Create a token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.accountVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.accountVerificationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return verificationToken;
};

// Compile schema into a model
const User = mongoose.model('User', userSchema);

module.exports = User;
