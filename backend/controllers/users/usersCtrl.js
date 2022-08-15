const fs = require('fs');
const asyncHandler = require('express-async-handler');
const generateToken = require('../../config/token/generateToken.js');
const validateMongodbId = require('../../utils/validateMongodbId.js');
const User = require('../../models/user/User.js');
const sendEmail = require('../../utils/sendEmail.js');
const crypto = require('crypto');
const cloudinaryUploadImage = require('../../utils/cloudinary.js');

/**
 * @desc Register a new user
 */
const userRegisterCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.json(user);
  } catch (err) {
    if (err?.code === 11000) throw new Error('User already exists');
    else throw err;
  }
});

/**
 * @desc Login user
 */
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const userFound = await User.findOne({ email });

  // Check if password is mached
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      isAccountVerified: userFound?.isAccountVerified,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid Credentials' });
  }
});

/**
 * @desc Refresh token
 */
const refreshTokenCtrl = asyncHandler(async (req, res) => {
  const _userId = req.user?._id;

  // Check if user exists
  const userFound = await User.findById(_userId);

  res.json({
    _id: userFound?._id,
    firstName: userFound?.firstName,
    lastName: userFound?.lastName,
    email: userFound?.email,
    profilePhoto: userFound?.profilePhoto,
    isAdmin: userFound?.isAdmin,
    isAccountVerified: userFound?.isAccountVerified,
    token: generateToken(userFound?._id),
  });
});

/**
 * @desc Fetch all users
 */
const getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/**
 * @desc Delete user
 */
const deleteUserCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // Check if user _id is valid
  validateMongodbId(_id);

  const deletedUser = await User.findByIdAndDelete(_id);
  if (!deletedUser) throw new Error('User _id is not valid or found');

  res.json(deletedUser);
});

/**
 * @desc User details
 */
const fetchUserDetailsCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // Check if user _id is valid
  validateMongodbId(_id);

  const user = await User.findById(_id);
  res.json(user);
});

/**
 * @desc User Profile
 */
const userProfileCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // Check if user _id is valid
  validateMongodbId(_id);

  const myProfile = await User.findById(_id).populate('posts');
  res.json(myProfile);
});

/**
 * @desc Update user profile
 */
const updateUserCtrl = asyncHandler(async (req, res) => {
  const { _id } = req?.params;
  // const { _id } = req?.user;

  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate('posts');

  res.json(user);
});

/**
 * @desc Update user password
 */
const updateUserPasswordCtrl = asyncHandler(async (req, res) => {
  // Destructure the login user
  const { _id } = req?.user;
  const { password } = req?.body;

  validateMongodbId(_id);

  // Find the user by _id
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    throw new Error('Password is required');
  }
});

/**
 * @desc User following
 */
const followingUserCtrl = asyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user?._id;

  // 1. Find the target user and check if the login id exist
  const targetUser = await User.findById(followId);
  const isAlreadyFollowing = targetUser.followers?.some(
    (follower) => follower?.toString() === loginUserId?.toString()
  );

  if (isAlreadyFollowing)
    throw new Error('You are already following this user');

  // 2. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(
    followId,
    { $addToSet: { followers: loginUserId } },
    { new: true }
  );

  // 3. Update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $addToSet: { following: followId },
    },
    { new: true }
  );

  res.json('You have successfully followed the user');
});

/**
 * @desc User unfollowing
 */
const unfollowingUserCtrl = asyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user?._id;

  if (!unfollowId) throw new Error('Unfollow Id is required');

  await User.findByIdAndUpdate(
    unfollowId,
    { $pull: { followers: loginUserId } },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unfollowId },
    },
    { new: true }
  );

  res.json('You have successfully unfollowed the user');
});

/**
 * @desc Block user
 */
const blockUserCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const user = await User.findByIdAndUpdate(
    _id,
    {
      isBlocked: true,
    },
    { new: true }
  );

  res.json(user);
});

/**
 * @desc Unblock user
 */
const unblockUserCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const user = await User.findByIdAndUpdate(
    _id,
    {
      isBlocked: false,
    },
    { new: true }
  );

  res.json(user);
});

/**
 * @desc Generate email Verification - Send Email
 */
const generateVerificationTokenCtrl = asyncHandler(async (req, res) => {
  const loginUserId = req.user?._id;
  const loginUser = await User.findById(loginUserId);

  // Generate token
  const verificationToken = await loginUser.createVerificationToken();

  // Save the user
  await loginUser.save();

  // Send email
  const verifyURL = `${process.env.FRONTEND_URL}/verify-account/${verificationToken}`;
  const verifyHtml = `If you were requested to veify your account, verify now within 10 minutes, otherwise ignore this email.<br/><br/> <a href="${verifyURL}">Verify Account</a>`;

  const msg = {
    to: loginUser?.email,
    subject: 'Account Verification',
    html: verifyHtml,
  };

  await sendEmail(msg);

  if (process.env.NODE_ENV === 'development')
    res.json({ verificationToken, verifyURL, verifyHtml });
  else res.json({ msg: 'Email has sent' });
});

/**
 * @desc Account Verification - Verify Email
 */
const accountVerificationCtrl = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find this user by token
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationExpires: { $gt: Date.now() },
  });

  if (!userFound) throw new Error('Invalid token');

  // Update the isVerified to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;

  await userFound.save();

  res.json({ msg: 'Account verified' });
});

/**
 * @desc Generate password reset token
 */
const forgetPasswordTokenCtrl = asyncHandler(async (req, res) => {
  // Find the user by email
  const { email } = req.body;

  const userFound = await User.findOne({ email });
  if (!userFound) throw new Error('User not found');

  // Generate token
  const resetToken = await userFound.createPasswordResetToken();
  await userFound.save();

  // Send email
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const resetHtml = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this email.<br/><br/> <a href="${resetURL}">Reset Password</a>`;

  const msg = {
    to: 'develobing@gmail.com',
    subject: 'Reset your password',
    html: resetHtml,
  };

  await sendEmail(msg);

  if (process.env.NODE_ENV === 'development')
    res.json({ resetToken, resetURL, resetHtml });
  else res.json({ msg: 'Email has sent' });
});

/**
 * @desc Password reset
 */
const passwordResetCtrl = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find the user by token
  const userFound = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!userFound) throw new Error('Invalid token');

  // Update the password
  userFound.password = password;
  userFound.passwordResetToken = undefined;
  userFound.passwordResetExpires = undefined;

  await userFound.save();

  res.json({ msg: 'Password reset' });
});

/**
 * @desc Profile photo upload
 */
const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1. Get the path to image
  const localPath = `public/images/profile/${req.file.filename}`;

  // 2. Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImage(localPath);

  // 3. Find the login user and update the profile photo
  const loginUserId = req.user?._id;
  const profile = await User.findByIdAndUpdate(
    loginUserId,
    {
      profilePhoto: imgUploaded.url,
    },
    { new: true }
  ).populate('posts');

  res.json({
    profile,
    profilePhoto: imgUploaded.url,
    msg: 'Profile photo upload',
  });

  // Remove upload image from local server
  fs.unlinkSync(localPath);
});

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  getAllUsersCtrl,
  deleteUserCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowingUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  accountVerificationCtrl,
  forgetPasswordTokenCtrl,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
  refreshTokenCtrl,
};
