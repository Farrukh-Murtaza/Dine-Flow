const MenuItem = require("../models/menu-item-model");
const Category = require("../models/category-model");

// CREATE: Add a new menu item
async function createMenuItem(req, res) {
  try {
    const { name, description, price, category, imageUrl, isAvailable } = req.body;

    // 1. Validate that the chosen category actually exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Specified category does not exist." });
    }

    const newItem = new MenuItem({
      name,
      description,
      price,
      category,
      imageUrl,
      isAvailable
    });

    await newItem.save();
    res.status(201).json({ message: "Menu item created successfully!", menuItem: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// READ ALL: Fetch all menu items (with option to filter by category or availability)
async function getAllMenuItems(req, res) {
  try {
    const queryFilter = {};

    // Optional query parameter filtering (e.g., /api/menu-items?category=ID)
    if (req.query.category) queryFilter.category = req.query.category;
    if (req.query.isAvailable) queryFilter.isAvailable = req.query.isAvailable === "true";

    // .populate("category", "name") pulls the category name into the response object
    const items = await MenuItem.find(queryFilter).populate("category", "name");
    res.status(200).json({
      message: "All Menu Items",
      items
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// READ ONE: Fetch single dish by ID
async function getMenuItemById(req, res) {
  try {
    const item = await MenuItem.findById(req.params.id).populate("category", "name");
    if (!item) return res.status(404).json({ message: "Menu item not found." });

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// UPDATE: Modify dish specifications
async function updateMenuItem(req, res) {
  try {
    const { name, description, price, category, imageUrl, isAvailable } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return res.status(404).json({ message: "Specified category does not exist." });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, imageUrl , isAvailable},
      { new: true, runValidators: true }
    ).populate("category", "name");

    if (!updatedItem) return res.status(404).json({ message: "Menu item not found." });

    res.status(200).json({ message: "Menu item updated successfully!", menuItem: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// UPDATE STATUS: Toggle item availability (Kitchen stock control)
async function updateMenuItemStatus(req, res) {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({ message: "'isAvailable' must be a boolean (true or false)." });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    ).populate("category", "name");

    if (!updatedItem) return res.status(404).json({ message: "Menu item not found." });

    const statusText = isAvailable ? "available" : "out of stock";
    res.status(200).json({ message: `Item marked as ${statusText}.`, menuItem: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// DELETE: Hard-delete an item
async function deleteMenuItem(req, res) {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Menu item not found." });

    res.status(200).json({ message: "Menu item permanently deleted from menu." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  updateMenuItemStatus,
  deleteMenuItem
};
