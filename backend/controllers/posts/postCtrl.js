const fs = require('fs');
const asyncHandler = require('express-async-handler');
const Filter = require('bad-words');
const Post = require('../../models/post/Post');
const validateMongodbId = require('../../utils/validateMongodbId');
const User = require('../../models/user/User');
const cloudinaryUploadImage = require('../../utils/cloudinary');

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

  // 1. Get the path to image
  const localPath = `public/images/posts/${req.file.filename}`;

  // 2. Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImage(localPath);

  const post = await Post.create({
    ...req.body,
    image: imgUploaded.url,
    user: authorId,
  });

  res.json({ post });

  // Remove upload image from local server
  fs.unlinkSync(localPath);
});

module.exports = { createPostCtrl };
