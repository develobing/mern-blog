const express = require('express');
const { sendEmailCtrl } = require('../../controllers/emails/emailCtrl');
const {
  authMiddleware,
  checkBlockUser,
} = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

// Send Email
router.post('/', authMiddleware, checkBlockUser, sendEmailCtrl);

module.exports = router;
