const fs = require('fs');
const asyncHandler = require('express-async-handler');
const Filter = require('bad-words');
const Post = require('../../models/post/Post');
const validateMongodbId = require('../../utils/validateMongodbId');
const User = require('../../models/user/User');
const cloudinaryUploadImage = require('../../utils/cloudinary');

/**
 * @desc Fetch all posts
 */
const fetchPostsCtrl = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).populate('user');

  res.json({ posts });
});

/**
 * @desc Fetch a single post
 */
const fetchPostCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const post = await Post.findById(_id).populate('user');
  if (!post) throw new Error(`Post not found with _id of ${_id}`, 404);

  // Update number of views
  await Post.findByIdAndUpdate(_id, { $inc: { numViews: 1 } }, { new: true });

  res.json({ post });
});

/**
 * @desc Create a post
 */
const createPostCtrl = asyncHandler(async (req, res) => {
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

/**
 * @desc Update a post
 */
const updatePost = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const post = await Post.findByIdAndUpdate(_id, req.body, { new: true });

  res.json({ post });
});

/**
 * @desc Delete a post
 */
const deletePost = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const post = await Post.findByIdAndDelete(_id);
  if (!post) throw new Error(`Post not found with _id of ${_id}`);

  res.json({ post, message: 'Post deleted' });
});

module.exports = {
  fetchPostsCtrl,
  fetchPostCtrl,
  createPostCtrl,
  updatePost,
  deletePost,
};
