const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// Storage
const multerStorage = multer.memoryStorage();

// File type check
const multerFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

// Profile Image Resizing
const profilePhotoResize = async (req, res, next) => {
  // Check if there is no file
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

  next();
};

// Post Image Resizing
const postPhotoResize = async (req, res, next) => {
  // Check if there is no file
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));

  next();
};

module.exports = { photoUpload, profilePhotoResize, postPhotoResize };
