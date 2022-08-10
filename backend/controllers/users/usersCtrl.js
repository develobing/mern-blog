const asyncHandler = require('express-async-handler');
const User = require('../../models/user/User.js');

/**
 * @desc Register a new user
 */
const userRegisterCtrl = asyncHandler(async (req, res) => {
  // const isUserExist = await User.findOne({ email: req.body.email });
  // if (isUserExist) throw new Error('User already exist');

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

module.exports = {
  userRegisterCtrl,
};
