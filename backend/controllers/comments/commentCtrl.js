const asyncHandler = require('express-async-handler');
const Comment = require('../../models/comment/Comment');
const validateMongodbId = require('../../utils/validateMongodbId');

/**
 * @desc Fetch all comments
 */
const fetchAllComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find()
    .sort({ createdAt: -1 })
    .populate('user');

  res.json({ comments });
});

/**
 * @desc Fetch a single comment
 */
const fetchCommentCtrl = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const comment = await Comment.findById(_id).populate('user');
  if (!comment) throw new Error(`Comment not found with id of ${_id}`);

  res.json({ comment });
});

/**
 * @desc Create a comment
 */
const createCommentCtrl = asyncHandler(async (req, res, next) => {
  // 1. Get the user id
  const loginUserId = req.user?._id;

  // 2. Get the post id
  const { postId, description } = req.body;

  // 3. Check user id and post id
  validateMongodbId(loginUserId);
  validateMongodbId(postId);

  const comment = await Comment.create({
    user: loginUserId,
    post: postId,
    description,
  });

  res.json({ comment });
});

/**
 * @desc Update a comment
 */
const updateCommentCtrl = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const { description } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    _id,
    { description },
    { new: true, runValidators: true }
  ).populate('user');
  if (!comment) throw new Error(`Comment not found with id of ${_id}`);

  res.json({ comment });
});

/**
 * @desc Delete a comment
 */
const deleteCommentCtrl = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const comment = await Comment.findByIdAndDelete(_id).populate('user');
  if (!comment) throw new Error(`Comment not found with id of ${_id}`);

  res.json({ comment });
});

module.exports = {
  fetchAllComments,
  fetchCommentCtrl,
  createCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};
