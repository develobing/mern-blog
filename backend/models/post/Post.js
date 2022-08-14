const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Post description is required'],
    },

    // Created only by category
    category: {
      type: String,
      required: [true, 'Post category is required'],
    },

    isLiked: {
      type: Boolean,
      default: false,
    },

    isDisliked: {
      type: Boolean,
      default: false,
    },

    numViews: {
      type: Number,
      default: 0,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post author is required'],
    },

    image: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2014/05/21/15/18/musician-349790_960_720.jpg',
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
