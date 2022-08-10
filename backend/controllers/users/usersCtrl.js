const { response } = require('express');
const asyncHandler = require('express-async-handler');
const generateToken = require('../../config/token/generateToken.js');
const validateMongodbId = require('../../utils/validateMongodbId.js');
const User = require('../../models/user/User.js');

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
 * @desc User Details
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
 * @desc Update User Profile
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
 * @desc Update User Password
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

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  getAllUsersCtrl,
  deleteUserCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
};
