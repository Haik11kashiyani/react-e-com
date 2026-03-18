import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    tag: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["phone", "laptop", "audio", "smartwatch", "tablet", "accessories"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    images: [String],
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    features: [String],
    colors: [String],
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
