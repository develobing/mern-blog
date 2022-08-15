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
  const category = req.query.category;
  const filter = category ? { category } : {};
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    });

  res.json({ category, posts });
});

/**
 * @desc Fetch a single post
 */
const fetchPostCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const post = await Post.findById(_id)
    .populate('user likes dislikes')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    });

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

  let image;
  if (req.file) {
    // 1. Get the path to image
    const localPath = `public/images/posts/${req.file.filename}`;

    // 2. Upload to cloudinary
    const imgUploaded = await cloudinaryUploadImage(localPath);
    image = imgUploaded.url;

    // 3. Remove upload image from local server
    fs.unlinkSync(localPath);
  }

  const post = await Post.create({
    ...req.body,
    user: authorId,
    image,
  });

  res.json({ post });
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

/**
 * @desc Like a post
 */
const toggleLikePostCtrl = asyncHandler(async (req, res) => {
  // 1. Check if _id is valid
  const { _id } = req.params;
  validateMongodbId(_id);

  // 2. Find the post to be liked
  let post = await Post.findById(_id);
  if (!post) throw new Error(`Post not found with _id of ${_id}`);

  // 3. Find the login user
  const loginUserId = req.user?._id;

  // 4. Find if the user has already liked the post
  const isLiked = post.likes.find((like) => like.equals(loginUserId));

  // 5. Find if the user has already disliked the post
  const isDisliked = post.dislikes.find((dislike) =>
    dislike.equals(loginUserId)
  );

  // 6. Cancel the dislike if the user has already disliked the post
  if (isDisliked) {
    post = await Post.findByIdAndUpdate(
      _id,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
  }

  // 7. Update the post likes
  // 7.1. If the user has already like the post, remove the like
  if (isLiked) {
    post = await Post.findByIdAndUpdate(
      _id,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
  }

  // 7.2. If the user has not like the post, add the like
  else {
    post = await Post.findByIdAndUpdate(
      _id,
      {
        $addToSet: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
  }

  res.json({ post });
});

/**
 * @desc Dislike a post
 */
const toggleDislikePostCtrl = asyncHandler(async (req, res) => {
  // 1. Check if _id is valid
  const { _id } = req.params;
  validateMongodbId(_id);

  // 2. Find the post to be liked
  let post = await Post.findById(_id);
  if (!post) throw new Error(`Post not found with _id of ${_id}`);

  // 3. Find the login user
  const loginUserId = req.user?._id;

  // 4. Find if the user has already liked the post
  const isLiked = post.likes.find((like) => like.equals(loginUserId));

  // 5. Find if the user has already disliked the post
  const isDisliked = post.dislikes.find((dislike) =>
    dislike.equals(loginUserId)
  );

  // 6. Cancel the like if the user has already liked the post
  if (isLiked) {
    post = await Post.findByIdAndUpdate(
      _id,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
  }

  // 7. Update the post dislikes
  // 7.1. If the user has already dislike the post, remove the dislike
  if (isDisliked) {
    post = await Post.findByIdAndUpdate(
      _id,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
  }

  // 7.2. If the user has not dislike the post, add the dislike
  else {
    post = await Post.findByIdAndUpdate(
      _id,
      {
        $addToSet: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
  }

  res.json({ post });
});

module.exports = {
  fetchPostsCtrl,
  fetchPostCtrl,
  createPostCtrl,
  updatePost,
  deletePost,
  toggleLikePostCtrl,
  toggleDislikePostCtrl,
};
