const express = require('express');
const {
  fetchPostsCtrl,
  fetchPostCtrl,
  createPostCtrl,
  updatePost,
  deletePost,
  toggleLikePostCtrl,
  toggleDislikePostCtrl,
} = require('../../controllers/posts/postCtrl');
const { authMiddleware } = require('../../middlewares/auth/authMiddleware');
const {
  photoUpload,
  postPhotoResize,
} = require('../../middlewares/uploads/photoUpload');

const router = express.Router();

// Fetch all posts
router.get('/', fetchPostsCtrl);

// Fetch a single post
router.get('/:_id', fetchPostCtrl);

// Create a post
router.post(
  '/',
  authMiddleware,
  photoUpload.single('image'),
  postPhotoResize,
  createPostCtrl
);

// Update a post
router.put('/:_id', authMiddleware, updatePost);

// Like a post
router.put('/:_id/likes', authMiddleware, toggleLikePostCtrl);

// Like a post
router.put('/:_id/dislikes', authMiddleware, toggleDislikePostCtrl);

// Delete a post
router.delete('/:_id', authMiddleware, deletePost);

module.exports = router;
