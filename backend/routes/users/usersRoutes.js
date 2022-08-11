const express = require('express');
const {
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
} = require('../../controllers/users/usersCtrl');
const {
  authMiddleware,
  checkMyToken,
} = require('../../middlewares/auth/authMiddleware');

const usersRoutes = express.Router();

// User Registered
usersRoutes.post('/register', userRegisterCtrl);

// User login
usersRoutes.post('/login', loginUserCtrl);

// User All Fetch
usersRoutes.get('/', authMiddleware, getAllUsersCtrl);

// User Details Fetch
usersRoutes.get('/:_id', fetchUserDetailsCtrl);

// User Profile
usersRoutes.get('/profile/:_id', authMiddleware, checkMyToken, userProfileCtrl);

// User Verification Token Send
usersRoutes.post('/verify-token', generateVerificationTokenCtrl);

// User Following
usersRoutes.put('/follow', authMiddleware, followingUserCtrl);

// User Unfollowing
usersRoutes.put('/unfollow', authMiddleware, unfollowingUserCtrl);

// User Update
usersRoutes.put('/:_id', authMiddleware, checkMyToken, updateUserCtrl);

// User Password Update
usersRoutes.put(
  '/password/:_id',
  authMiddleware,
  checkMyToken,
  updateUserPasswordCtrl
);

// User Block
usersRoutes.put('/block/:_id', authMiddleware, blockUserCtrl);

// User Unblock
usersRoutes.put('/unblock/:_id', authMiddleware, unblockUserCtrl);

// User Delete
usersRoutes.delete('/:_id', deleteUserCtrl);

module.exports = usersRoutes;
