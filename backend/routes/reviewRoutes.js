import express from "express";
import { getTestimonials, getReviews, createReview } from "../controller/reviewController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/testimonials", getTestimonials);
router.get("/", getReviews);
router.post("/", auth, createReview);

export default router;
