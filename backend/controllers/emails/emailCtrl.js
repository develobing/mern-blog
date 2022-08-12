const asyncHandler = require('express-async-handler');
const Filter = require('bad-words');
const sendEmail = require('../../utils/sendEmail');
const Email = require('../../models/email/Email');
const User = require('../../models/user/User');

const sendEmailCtrl = asyncHandler(async (req, res, next) => {
  const { _id: loginUserId, email: loginUserEmail } = req.user;
  const { to, subject, message } = req.body;

  // 1. Check if message has bad words
  const filter = new Filter();
  if (filter.isProfane(subject, message)) {
    // Block user
    await User.findByIdAndUpdate(loginUserId, { isBlocked: true });
    throw new Error(
      'Failed to create because it contains profane words and you have been blocked.'
    );
  }

  // 2. Send Email
  const msg = {
    to,
    subject,
    text: message,
  };

  const results = await sendEmail(msg);
  const result = results?.[0];
  if (!`${result?.statusCode}`.startsWith(2)) throw new Error('Email not sent');

  // 3. Save to DB
  const email = await Email.create({
    from: loginUserEmail,
    to,
    subject,
    message,
    sentBy: loginUserId,
  });

  res.json({ email });
});

module.exports = { sendEmailCtrl };
