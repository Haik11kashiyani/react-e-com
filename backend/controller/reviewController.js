import Review from "../models/Review.js";

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
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("getReviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
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
