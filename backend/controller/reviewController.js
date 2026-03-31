import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import { refreshProductRating } from "../utils/reviewStats.js";

// GET /api/reviews/testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Review.find({ isTestimonial: true }).sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error("getTestimonials error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/reviews
export const getReviews = async (req, res) => {
  try {
    const { productId, isTestimonial } = req.query;
    const filter = {};

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      filter.productId = new mongoose.Types.ObjectId(productId);
    }

    if (isTestimonial === "true") filter.isTestimonial = true;
    if (isTestimonial === "false") filter.isTestimonial = false;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email");

    let summary = null;
    if (filter.productId) {
      const [stats] = await Review.aggregate([
        { $match: { productId: filter.productId } },
        {
          $group: {
            _id: "$productId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
            oneStar: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
            twoStar: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
            threeStar: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
            fourStar: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
            fiveStar: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          },
        },
      ]);

      summary = {
        averageRating: Number((stats?.averageRating || 0).toFixed(1)),
        totalReviews: stats?.totalReviews || 0,
        distribution: {
          1: stats?.oneStar || 0,
          2: stats?.twoStar || 0,
          3: stats?.threeStar || 0,
          4: stats?.fourStar || 0,
          5: stats?.fiveStar || 0,
        },
      };
    }

    res.json({ success: true, reviews, summary });
  } catch (error) {
    console.error("getReviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { productId, rating, text, title } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Valid productId is required" });
    }

    if (!rating || !text) {
      return res.status(400).json({ success: false, message: "Rating and review text are required" });
    }

    const product = await Product.findById(productId).select("name");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const hasPurchased = await Order.exists({
      user: req.user._id,
      status: { $ne: "cancelled" },
      "items.product": product._id,
    });

    const reviewData = {
      user: req.user._id,
      name: `${req.user.firstName} ${req.user.lastName}`.trim(),
      role: "Customer",
      avatar: req.user.profilePic || null,
      productId: product._id,
      product: product.name,
      rating: Number(rating),
      title: title || "",
      text,
      isTestimonial: false,
      isVerifiedPurchase: Boolean(hasPurchased),
    };

    const review = await Review.findOneAndUpdate(
      { user: req.user._id, productId: product._id },
      reviewData,
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    await refreshProductRating(product._id);

    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    console.error("createReview error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
