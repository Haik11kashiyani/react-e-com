import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

export const calculateCouponDiscount = ({ coupon, subtotal }) => {
  if (coupon.type === "percent") {
    const raw = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount != null) {
      return Math.min(raw, coupon.maxDiscount);
    }
    return raw;
  }

  if (coupon.type === "flat") {
    return Math.min(coupon.value, subtotal);
  }

  return 0;
};

export const validateCouponForUser = async ({ code, subtotal = 0, userId = null }) => {
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!normalizedCode) {
    return { ok: false, status: 400, message: "Enter a coupon code" };
  }

  const coupon = await Coupon.findOne({ code: normalizedCode, isActive: true });
  if (!coupon) {
    return { ok: false, status: 404, message: "Invalid coupon code" };
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { ok: false, status: 400, message: "Coupon is not active yet" };
  }

  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { ok: false, status: 400, message: "Coupon has expired" };
  }

  if (Number(subtotal) < Number(coupon.minSubtotal || 0)) {
    return {
      ok: false,
      status: 400,
      message: `Coupon can be used only on orders above ${coupon.minSubtotal}`,
    };
  }

  if (coupon.usageLimitTotal != null) {
    const totalUsage = await Order.countDocuments({
      couponCode: coupon.code,
      status: { $ne: "cancelled" },
    });

    if (totalUsage >= coupon.usageLimitTotal) {
      return { ok: false, status: 400, message: "Coupon usage limit reached" };
    }
  }

  if ((coupon.firstOrderOnly || coupon.usageLimitPerUser != null) && !userId) {
    return { ok: false, status: 401, message: "Please login to use this coupon" };
  }

  if (coupon.firstOrderOnly && userId) {
    const priorOrders = await Order.countDocuments({
      user: userId,
      status: { $ne: "cancelled" },
    });

    if (priorOrders > 0) {
      return { ok: false, status: 400, message: "This coupon is only for new users" };
    }
  }

  if (coupon.usageLimitPerUser != null && userId) {
    const usedByUser = await Order.countDocuments({
      user: userId,
      couponCode: coupon.code,
      status: { $ne: "cancelled" },
    });

    if (usedByUser >= coupon.usageLimitPerUser) {
      return { ok: false, status: 400, message: "You have already used this coupon" };
    }
  }

  const discount = calculateCouponDiscount({ coupon, subtotal: Number(subtotal) });
  return { ok: true, coupon, discount };
};
