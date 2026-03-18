import User from "../models/Users.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import Review from "../models/Review.js";
import ContactMessage from "../models/ContactMessage.js";

// ─── Dashboard Stats ─────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalReviews, totalContacts] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Review.countDocuments(),
        ContactMessage.countDocuments({ isRead: false }),
      ]);

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "firstName lastName email");

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        totalReviews,
        unreadContacts: totalContacts,
        recentOrders,
        ordersByStatus,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── Users CRUD ──────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({
      success: true,
      users,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    console.error("toggleUserActive error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── Orders ──────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "firstName lastName email"),
      Order.countDocuments(filter),
    ]);
    res.json({
      success: true,
      orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate(
      "user",
      "firstName lastName email"
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── Coupons CRUD ────────────────────────────────────
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }
    console.error("createCoupon error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    res.json({ success: true, coupon });
  } catch (error) {
    console.error("updateCoupon error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error("deleteCoupon error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── Reviews ─────────────────────────────────────────
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("deleteReview error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── Contact Messages ────────────────────────────────
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    console.error("getContactMessages error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markContactRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, message: msg });
  } catch (error) {
    console.error("markContactRead error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, message: "Contact message deleted" });
  } catch (error) {
    console.error("deleteContact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
