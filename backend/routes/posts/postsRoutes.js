const express = require('express');
const { createPostCtrl } = require('../../controllers/posts/postCtrl');
const { authMiddleware } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createPostCtrl);

module.exports = router;
