const express = require('express');
const {
  fetchAllCategoriesCtrl,
  fetchCategoryCtrl,
  createCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require('../../controllers/categories/categoryCtrl');
const { authMiddleware } = require('../../middlewares/auth/authMiddleware');

const router = express.Router();

// Fetch all categories
router.get('/', authMiddleware, fetchAllCategoriesCtrl);

// Fetch a category
router.get('/:_id', authMiddleware, fetchCategoryCtrl);

// Create a category
router.post('/', authMiddleware, createCategoryCtrl);

// Update a category
router.put('/:_id', authMiddleware, updateCategoryCtrl);

// Delete a category
router.delete('/:_id', authMiddleware, deleteCategoryCtrl);

module.exports = router;
