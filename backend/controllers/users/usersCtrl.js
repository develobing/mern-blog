const asyncHandler = require('express-async-handler');
const generateToken = require('../../config/token/generateToken.js');
const validateMongodbId = require('../../utils/validateMongodbId.js');
const User = require('../../models/user/User.js');
const sendEmail = require('../../utils/sendEmail.js');

/**
 * @desc Register a new user
 */
const userRegisterCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  res.json(user);
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
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid Credentials' });
  }
});

/**
 * @desc Fetch all users
 */
const getAllUsersCtrl = asyncHandler(async (req, res) => {
  console.log('req.headers: ', req.headers);

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

  const myProfile = await User.findById(_id);
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
  );

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
    {
      $addToSet: { followers: loginUserId },
      isFollowing: true,
    },
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
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
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
 * @desc Account Verification - Send Email
 */
const generateVerificationTokenCtrl = asyncHandler(async (req, res) => {
  const msg = {
    to: 'develobing@gmail.com',
    subject: 'Account Verification',
    text: 'Please verify your account',
  };

  const result = await sendEmail(msg);

  res.json({ result, text: 'Email sent' });
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
};
