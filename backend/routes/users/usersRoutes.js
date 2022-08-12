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
  accountVerificationCtrl,
  forgetPasswordTokenCtrl,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
} = require('../../controllers/users/usersCtrl');
const {
  authMiddleware,
  checkMyToken,
} = require('../../middlewares/auth/authMiddleware');
const {
  photoUpload,
  profilePhotoResize,
} = require('../../middlewares/uploads/photoUpload');

const usersRoutes = express.Router();

// User registered
usersRoutes.post('/register', userRegisterCtrl);

// User login
usersRoutes.post('/login', loginUserCtrl);

// User all fetch
usersRoutes.get('/', authMiddleware, getAllUsersCtrl);

// User details fetch
usersRoutes.get('/:_id', fetchUserDetailsCtrl);

// User profile
usersRoutes.get('/profile/:_id', authMiddleware, checkMyToken, userProfileCtrl);

// User profile photo upload
usersRoutes.put(
  '/profile-photo',
  authMiddleware,
  photoUpload.single('image'),
  profilePhotoResize,
  profilePhotoUploadCtrl
);

// User verification token
usersRoutes.post(
  '/verify-token',
  authMiddleware,
  generateVerificationTokenCtrl
);

// User account verification
usersRoutes.put('/verify-account', authMiddleware, accountVerificationCtrl);

// Forget password token
usersRoutes.post('/forget-password', forgetPasswordTokenCtrl);

// Forget password token
usersRoutes.put('/reset-password', passwordResetCtrl);

// User following
usersRoutes.put('/follow', authMiddleware, followingUserCtrl);

// User unfollowing
usersRoutes.put('/unfollow', authMiddleware, unfollowingUserCtrl);

// User update
usersRoutes.put('/:_id', authMiddleware, checkMyToken, updateUserCtrl);

// User password update
usersRoutes.put(
  '/password/:_id',
  authMiddleware,
  checkMyToken,
  updateUserPasswordCtrl
);

// User block
usersRoutes.put('/block/:_id', authMiddleware, blockUserCtrl);

// User unblock
usersRoutes.put('/unblock/:_id', authMiddleware, unblockUserCtrl);

// User delete
usersRoutes.delete('/:_id', deleteUserCtrl);

module.exports = usersRoutes;
