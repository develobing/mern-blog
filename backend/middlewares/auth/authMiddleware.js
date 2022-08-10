const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../../models/user/User');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const isBearerHeader = !!req?.headers?.authorization?.startsWith('Bearer');

  if (isBearerHeader) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by id
        const user = await User.findOne({ _id: decoded?.id }).select(
          '-password'
        );

        // Attach the user to the request object
        req.user = user;

        next();
      } else {
        throw new Error('Not authorized token expired, login again');
      }
    } catch (err) {
      throw new Error('Not authorized token expired, login again');
    }
  } else {
    throw new Error('Not authorized');
  }
});

const checkMyToken = asyncHandler(async (req, res, next) => {
  const _id = req?.params?._id;
  const _userId = req?.user?._id?.toString();
  const isTokenUser = _id === _userId;

  if (isTokenUser) next();
  else throw new Error('You are not authorized to update this user');
});

module.exports = { authMiddleware, checkMyToken };
