const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },   // snapshot at order time
    price: { type: Number, required: true },  // snapshot at order time
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: true, trim: true },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Link Category model
        required: [true, "Order item must belong to a user."],
      },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "served", "completed"],
      default: "pending",
    },

    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);