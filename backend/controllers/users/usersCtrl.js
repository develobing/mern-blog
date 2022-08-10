const User = require('../../models/user/User.js');

/**
 * @desc Register a new user
 */
const userRegisterCtrl = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  userRegisterCtrl,
};
