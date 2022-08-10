const asyncHandler = require('express-async-handler');
const generateToken = require('../../config/token/generateToken.js');
const User = require('../../models/user/User.js');

/**
 * @desc Register a new user
 */
const userRegisterCtrl = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.json(user);
  } catch (err) {
    res.json(err);
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

module.exports = { userRegisterCtrl, loginUserCtrl };
