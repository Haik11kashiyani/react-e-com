import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    avatar: String,
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    product: { type: String, trim: true },
    title: { type: String, trim: true },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isTestimonial: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, productId: 1 }, { unique: true, partialFilterExpression: { productId: { $type: "objectId" } } });

export default mongoose.model("Review", reviewSchema);
