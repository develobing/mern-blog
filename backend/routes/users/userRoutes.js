const express = require('express');
const {
  userRegisterCtrl,
  loginUserCtrl,
  refreshTokenCtrl,
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

const router = express.Router();

// User registered
router.post('/register', userRegisterCtrl);

// User login
router.post('/login', loginUserCtrl);

// Refresh token
router.post('/refresh-token', authMiddleware, refreshTokenCtrl);

// User all fetch
router.get('/', authMiddleware, getAllUsersCtrl);

// User details fetch
router.get('/:_id', fetchUserDetailsCtrl);

// User profile
router.get('/profile/:_id', authMiddleware, userProfileCtrl);

// User profile photo upload
router.put(
  '/profile-photo',
  authMiddleware,
  photoUpload.single('image'),
  profilePhotoResize,
  profilePhotoUploadCtrl
);

// User verification token
router.post('/verify-token', authMiddleware, generateVerificationTokenCtrl);

// User account verification
router.put('/verify-account', authMiddleware, accountVerificationCtrl);

// Forget password token
router.post('/forget-password', forgetPasswordTokenCtrl);

// Forget password token
router.put('/reset-password', passwordResetCtrl);

// User following
router.put('/follow', authMiddleware, followingUserCtrl);

// User unfollowing
router.put('/unfollow', authMiddleware, unfollowingUserCtrl);

// User update
router.put('/:_id', authMiddleware, checkMyToken, updateUserCtrl);

// User password update
router.put(
  '/password/:_id',
  authMiddleware,
  checkMyToken,
  updateUserPasswordCtrl
);

// User block
router.put('/block/:_id', authMiddleware, blockUserCtrl);

// User unblock
router.put('/unblock/:_id', authMiddleware, unblockUserCtrl);

// User delete
router.delete('/:_id', deleteUserCtrl);

module.exports = router;
