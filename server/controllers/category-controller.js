const Category = require("../models/category-model");
const MenuItem = require("../models/menu-item-model");

// CREATE: Add a new category
async function createCategory(req, res) {
  try {
    const { name, description, displayOrder } = req.body;

    const newCategory = new Category({ name, description, displayOrder });
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully!", category: newCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name must be unique." });
    }
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// READ ALL: Fetch all categories (sorted by displayOrder)
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find().sort({ displayOrder: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// READ ONE: Get a single category by ID
async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// UPDATE: Modify category details
async function updateCategory(req, res) {
  try {
    const { name, description, displayOrder } = req.body;

    // Use runValidators to force Mongoose schema rules on updates
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, displayOrder },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: "Category not found." });

    res.status(200).json({ message: "Category updated successfully!", category: updatedCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name must be unique." });
    }
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// DELETE: Safely remove a category if no items are using it
async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.id;

    // 1. Check if any menu items are linked to this category
    const itemsCount = await MenuItem.countDocuments({ category: categoryId });
    if (itemsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. There are ${itemsCount} menu items attached to it. Reassign or delete those items first.`
      });
    }

    // 2. Perform deletion if count is 0
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) return res.status(404).json({ message: "Category not found." });

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};