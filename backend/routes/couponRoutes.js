import express from "express";
import { validateCoupon, getCoupons } from "../controller/couponController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/validate", validateCoupon);
router.get("/", auth, getCoupons);

export default router;
