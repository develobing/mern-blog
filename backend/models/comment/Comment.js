const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Comment post is required'],
    },

    user: {
      type: Object,
      required: [true, 'Comment author is required'],
    },

    description: {
      type: String,
      required: [true, 'Comment description is required'],
    },
  },

  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
