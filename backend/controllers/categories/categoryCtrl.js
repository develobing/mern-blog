const asyncHandler = require('express-async-handler');
const Category = require('../../models/category/Category');
const validateMongodbId = require('../../utils/validateMongodbId');

/**
 * @desc Fetch all categories
 */
const fetchAllCategoriesCtrl = asyncHandler(async (req, res, next) => {
  const categories = await Category.find()
    .populate('user')
    .sort({ createdAt: -1 });

  res.json({ categories });
});

/**
 * @desc Fetch a category
 */
const fetchCategoryCtrl = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const category = await Category.findById({ _id }).populate('user');
  if (!category) throw new Error(`Category with id ${_id} not found`, 404);

  res.json({ category });
});

/**
 * @desc Create a category
 */
const createCategoryCtrl = asyncHandler(async (req, res, next) => {
  try {
    const loginUserId = req.user?._id;
    const category = await Category.create({
      user: loginUserId,
      title: req.body?.title,
    });

    res.json(category);
  } catch (err) {
    if (err?.code === 11000) throw new Error('Category already exists');
    else throw err;
  }
});

/**
 * @desc Update a category
 */
const updateCategoryCtrl = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const loginUserId = req.user?._id;
  const category = await Category.findByIdAndUpdate(
    { _id, user: loginUserId },
    { title: req.body?.title },
    { new: true, runValidators: true }
  );
  if (!category) throw new Error(`Category with id ${_id} not found`, 404);

  res.json(category);
});

/**
 * @desc Delete a category
 */
const deleteCategoryCtrl = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  validateMongodbId(_id);

  const loginUserId = req.user?._id;
  const category = await Category.findByIdAndDelete({ _id, user: loginUserId });
  if (!category) throw new Error(`Category with id ${_id} not found`, 404);

  res.json(category);
});

module.exports = {
  fetchAllCategoriesCtrl,
  fetchCategoryCtrl,
  createCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
