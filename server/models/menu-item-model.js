const mongoose = require("mongoose");

const menuItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Menu item name is required."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Menu item description is required."],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
    min: [0, "Price cannot be negative."],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Link Category model
    required: [true, "Menu item must belong to a category."],
  },
  imageUrl: {
    type: String,
    default: "", // URL path to food photography
  },
  isAvailable: {
    type: Boolean,
    default: true, 
    required: true,
  },
}, {
  timestamps: true
});

// Index common search items to keep database lookups fast
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
module.exports = MenuItem;