import express from "express";
import { getTestimonials, getReviews, createReview } from "../controller/reviewController.js";

const router = express.Router();

router.get("/testimonials", getTestimonials);
router.get("/", getReviews);
router.post("/", createReview);

export default router;
