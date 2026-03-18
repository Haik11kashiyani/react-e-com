import Coupon from "../models/Coupon.js";

// POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Enter a coupon code" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        label: coupon.label,
      },
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
