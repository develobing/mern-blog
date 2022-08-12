const asyncHandler = require('express-async-handler');
const Filter = require('bad-words');
const Post = require('../../models/post/Post');
const validateMongodbId = require('../../utils/validateMongodbId');
const User = require('../../models/user/User');

const createPostCtrl = asyncHandler(async (req, res, next) => {
  const authorId = req.body?.user;
  validateMongodbId(authorId);

  // Check bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);

  if (isProfane) {
    // Block user
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { isBlocked: true });
    throw new Error(
      'Failed to create because it contains profane words and you have been blocked. '
    );
  }

  const post = await Post.create(req.body);

  res.json({ post, isProfane });
});

module.exports = { createPostCtrl };
