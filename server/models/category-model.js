const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required."],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0, // Helps you sort categories on the frontend (e.g., Appetizers first)
  }
}, {
  timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
