const express = require('express');
const { createPostCtrl } = require('../../controllers/posts/postCtrl');
const { authMiddleware } = require('../../middlewares/auth/authMiddleware');
const {
  photoUpload,
  postPhotoResize,
} = require('../../middlewares/uploads/photoUpload');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  photoUpload.single('image'),
  postPhotoResize,
  createPostCtrl
);

module.exports = router;
