import express from "express";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  toggleUserActive,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  deleteReview,
  getContactMessages,
  markContactRead,
  deleteContact,
} from "../controller/adminController.js";

const router = express.Router();

// All routes are protected by auth + adminAuth
router.use(auth, adminAuth);

// Dashboard
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/toggle-active", toggleUserActive);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Orders
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

// Coupons
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

// Reviews
router.delete("/reviews/:id", deleteReview);

// Contact messages
router.get("/contacts", getContactMessages);
router.patch("/contacts/:id/read", markContactRead);
router.delete("/contacts/:id", deleteContact);

export default router;
