import Order from "../models/Order.js";

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, discount, couponCode, shipping, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items" });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      couponCode,
      shipping,
      total,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    console.error("createOrder error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders  (user's orders)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image price");

    res.json({ success: true, orders });
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name image price");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
