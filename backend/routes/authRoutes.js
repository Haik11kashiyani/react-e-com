import express from "express";
import {
	register,
	login,
	getMe,
	updateProfile,
	verifyEmailOtp,
	resendEmailOtp,
	requestPasswordResetOtp,
	verifyPasswordResetOtp,
	resetPasswordWithOtp,
} from "../controller/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/resend-email-otp", resendEmailOtp);
router.post("/forgot-password/request-otp", requestPasswordResetOtp);
router.post("/forgot-password/verify-otp", verifyPasswordResetOtp);
router.post("/forgot-password/reset", resetPasswordWithOtp);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);

export default router;
