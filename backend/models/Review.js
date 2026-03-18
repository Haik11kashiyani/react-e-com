import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    avatar: String,
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
    product: {
      type: String,
      trim: true,
    },
    isTestimonial: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
