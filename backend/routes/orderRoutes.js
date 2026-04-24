import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  createPaymentIntent,
  confirmPayment,
  getStripeKey,
} from "../controller/orderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Stripe payment routes
router.get("/stripe-key", auth, getStripeKey);
router.post("/create-payment-intent", auth, createPaymentIntent);
router.post("/confirm-payment", auth, confirmPayment);

// Standard order routes
router.post("/", auth, createOrder);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

export default router;
