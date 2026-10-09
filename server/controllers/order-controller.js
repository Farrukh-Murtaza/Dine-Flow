const mongoose = require("mongoose");
const Order = require("../models/order-model");
const MenuItem = require("../models/menu-item-model");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Build order lines from menu items so prices come from the DB, not the client
const buildItems = async (items) => {
  const ids = items.map((i) => i.menuItem);
  if (!ids.every(isValidId)) throw new Error("Invalid menuItem id");
  

  const menuItems = await MenuItem.find({ _id: { $in: ids } });
  const map = new Map(menuItems.map((m) => [m._id.toString(), m]));

  return items.map(({ menuItem, quantity }) => {
    const found = map.get(String(menuItem));
    if (!found) throw new Error(`Menu item not found: ${menuItem}`);
    return { menuItem: found._id, name: found.name.trim(), price: found.price, quantity };
  });
};

const calcTotal = (items) =>
  Number(items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2));

// POST /api/orders
createOrder = async (req, res) => {


  try {
    const { tableNumber, items, notes } = req.body;
    if (!String(tableNumber ?? "").trim()) {
      return res.status(400).json({ message: "tableNumber is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items are required" });
    }

    const tableReserver = Order.findOne({tableNmber: tableNumber, status : "pending"});
    if(tableReserver){
      return res.status(400).json({message: `Table NO.:${tableNumber} is already taken. Please choose another table`})
    }

    const orderItems = await buildItems(items);
    const orderFields = {
      tableNumber,
      notes,
      user: req.user._id,
      items: orderItems,
      total: calcTotal(orderItems),
    }; 
    const order = await Order.create(orderFields);

    res.status(201).json(order);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// GET /api/orders?status=pending&page=1&limit=10
getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};

    if(req.user.role === 'cashier'){
      filter.user = req.user._id
    }

    const [orders, count] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('user', 'id username'),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, page: Number(page), pages: Math.ceil(count / limit), count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
getOrderById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const order = await Order.findById(req.params.id).populate("items.menuItem", "name imageUrl category");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/:id
updateOrder = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const { tableNumber, items, status, notes } = req.body;
    const update = {};
    if (tableNumber !== undefined) update.tableNumber = tableNumber;
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.notes = notes;

    if (items !== undefined) {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "items cannot be empty" });
      }
      update.items = await buildItems(items);
      update.total = calcTotal(update.items);
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/orders/:id
deleteOrder = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid id" });

    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
}