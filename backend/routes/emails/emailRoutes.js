const express = require('express');
const { sendEmailCtrl } = require('../../controllers/emails/emailCtrl');
const { authMiddleware } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

// Send Email
router.post('/', authMiddleware, sendEmailCtrl);

module.exports = router;
