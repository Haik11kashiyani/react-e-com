import Stripe from "stripe";
import Order from "../models/Order.js";
import { validateCouponForUser } from "../utils/couponEngine.js";
import process from "process";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, discount, couponCode, shipping, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items" });
    }

    let normalizedDiscount = Number(discount || 0);
    let normalizedShipping = Number(shipping || 0);

    if (couponCode) {
      const result = await validateCouponForUser({
        code: couponCode,
        subtotal: Number(subtotal),
        userId: req.user._id,
      });

      if (!result.ok) {
        return res.status(result.status).json({ success: false, message: result.message });
      }

      normalizedDiscount = result.discount;
      if (result.coupon.type === "shipping") {
        normalizedShipping = 0;
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount: normalizedDiscount,
      couponCode,
      shipping: normalizedShipping,
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

// POST /api/orders/create-payment-intent
// Creates a Stripe PaymentIntent — no card data touches this server
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, shippingAddress, items, subtotal, discount, couponCode, shipping } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items" });
    }

    // Amount must be in smallest currency unit (paisa for INR)
    const amountInPaisa = Math.round(amount * 100);

    // Create the PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaisa,
      currency: currency || "inr",
      metadata: {
        userId: req.user._id.toString(),
        orderItems: JSON.stringify(items.map(i => ({ id: i.product || i._id, qty: i.qty }))),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("createPaymentIntent error:", error);
    res.status(500).json({ success: false, message: "Failed to create payment intent" });
  }
};

// POST /api/orders/confirm-payment
// Verifies payment with Stripe and creates the order in DB
export const confirmPayment = async (req, res) => {
  try {
    const {
      paymentIntentId,
      items,
      shippingAddress,
      subtotal,
      discount,
      couponCode,
      shipping,
      total,
    } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ success: false, message: "Payment intent ID is required" });
    }

    // Verify the payment with Stripe API — server-side verification
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${paymentIntent.status}`,
        paymentStatus: paymentIntent.status,
      });
    }

    // Validate coupon if provided
    let normalizedDiscount = Number(discount || 0);
    let normalizedShipping = Number(shipping || 0);

    if (couponCode) {
      const result = await validateCouponForUser({
        code: couponCode,
        subtotal: Number(subtotal),
        userId: req.user._id,
      });

      if (result.ok) {
        normalizedDiscount = result.discount;
        if (result.coupon.type === "shipping") {
          normalizedShipping = 0;
        }
      }
    }

    // Check if order already exists for this payment (idempotency)
    const existingOrder = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
    if (existingOrder) {
      return res.json({ success: true, order: existingOrder, message: "Order already created" });
    }

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: "stripe",
      paymentStatus: "paid",
      stripePaymentIntentId: paymentIntentId,
      subtotal,
      discount: normalizedDiscount,
      couponCode,
      shipping: normalizedShipping,
      total,
      status: "confirmed",
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("confirmPayment error:", error);
    res.status(500).json({ success: false, message: "Failed to confirm payment" });
  }
};

// GET /api/orders/stripe-key
// Returns the publishable key for frontend — this key is safe to expose
export const getStripeKey = async (req, res) => {
  res.json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
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
