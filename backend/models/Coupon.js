import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["percent", "flat", "shipping"],
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    label: {
      type: String,
      required: true,
    },
    minSubtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
      min: 0,
    },
    firstOrderOnly: {
      type: Boolean,
      default: false,
    },
    usageLimitPerUser: {
      type: Number,
      default: null,
      min: 1,
    },
    usageLimitTotal: {
      type: Number,
      default: null,
      min: 1,
    },
    startsAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
