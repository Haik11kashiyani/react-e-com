import Coupon from "../models/Coupon.js";
import jwt from "jsonwebtoken";
import process from "process";
import User from "../models/Users.js";
import { validateCouponForUser } from "../utils/couponEngine.js";

const resolveUserFromAuthHeader = async (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id).select("_id");
  } catch {
    return null;
  }
};

// POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    const user = await resolveUserFromAuthHeader(req);
    const result = await validateCouponForUser({
      code,
      subtotal: Number(subtotal),
      userId: user?._id || null,
    });

    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const { coupon, discount } = result;

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        label: coupon.label,
        minSubtotal: coupon.minSubtotal,
        firstOrderOnly: coupon.firstOrderOnly,
        maxDiscount: coupon.maxDiscount,
      },
      discount,
    });
  } catch (error) {
    console.error("validateCoupon error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/coupons (admin)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.error("getCoupons error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
