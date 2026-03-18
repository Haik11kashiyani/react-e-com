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
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
