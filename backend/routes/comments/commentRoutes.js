const express = require('express');
const {
  fetchAllComments,
  fetchCommentCtrl,
  createCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} = require('../../controllers/comments/commentCtrl');
const { authMiddleware } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

// Fetch all comments
router.get('/', authMiddleware, fetchAllComments);

// Fetch a comment
router.get('/:_id', authMiddleware, fetchCommentCtrl);

// Create a comment
router.post('/', authMiddleware, createCommentCtrl);

// Update a comment
router.put('/:_id', authMiddleware, updateCommentCtrl);

// Delete a comment
router.delete('/:_id', authMiddleware, deleteCommentCtrl);

module.exports = router;
