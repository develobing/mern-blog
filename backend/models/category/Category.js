const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      unique: true,
    },
  },

  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
