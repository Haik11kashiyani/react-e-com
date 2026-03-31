import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import process from "process";
import crypto from "crypto";
import { sendVerificationEmail } from "../config/mailer.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const setOtpDetails = (fieldPrefix, otp) => ({
  [`${fieldPrefix}OtpHash`]: hashOtp(otp),
  [`${fieldPrefix}OtpExpiresAt`]: new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
  ),
});

const clearOtpDetails = (fieldPrefix) => ({
  [`${fieldPrefix}OtpHash`]: null,
  [`${fieldPrefix}OtpExpiresAt`]: null,
});

const sendOtpEmail = async ({ toEmail, otp, purpose }) => {
  const title = purpose === "emailVerification" ? "Verify your email" : "Reset your password";
  const actionText =
    purpose === "emailVerification"
      ? "Use this OTP to verify your account"
      : "Use this OTP to reset your account password";

  await sendVerificationEmail({
    toEmail,
    subject: `TechOrbit - ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 8px;">${title}</h2>
        <p>${actionText}. This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 16px 0; color: #111827;">
          ${otp}
        </div>
        <p style="margin-top: 20px; color: #6b7280;">
          If you did not request this, you can ignore this email.
        </p>
      </div>
    `,
  });
};

const findUserForPasswordReset = async ({ email, adminOnly = false, withSensitive = false }) => {
  const query = { email: email.toLowerCase() };
  if (adminOnly) {
    query.role = "admin";
  }

  const selection = withSensitive
    ? "+password +resetPasswordOtpHash +resetPasswordOtpExpiresAt"
    : "+resetPasswordOtpHash +resetPasswordOtpExpiresAt";

  return User.findOne(query).select(selection);
};

const userResponse = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  profilePic: user.profilePic,
  isEmailVerified: user.isEmailVerified,
});

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, password, agreeTerms } =
      req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      if (!existing.isEmailVerified) {
        const otp = generateOtp();
        const otpDetails = setOtpDetails("emailVerification", otp);

        existing.firstName = firstName ?? existing.firstName;
        existing.lastName = lastName ?? existing.lastName;
        existing.phone = phone ?? existing.phone;
        existing.gender = gender ?? existing.gender;
        existing.password = password ?? existing.password;
        existing.agreeTerms = agreeTerms ?? true;
        existing.isActive = false;
        existing.set(otpDetails);

        await existing.save();
        await sendOtpEmail({
          toEmail: normalizedEmail,
          otp,
          purpose: "emailVerification",
        });

        return res.status(200).json({
          success: true,
          message: "Email already exists but is not verified. New OTP sent.",
          requiresVerification: true,
          email: normalizedEmail,
        });
      }

      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const otp = generateOtp();
    const otpDetails = setOtpDetails("emailVerification", otp);

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      gender,
      password,
      agreeTerms: agreeTerms ?? true,
      isActive: false,
      isEmailVerified: false,
      ...otpDetails,
    });

    await sendOtpEmail({
      toEmail: user.email,
      otp,
      purpose: "emailVerification",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email with OTP.",
      requiresVerification: true,
      email: user.email,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res

        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    console.error("Register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      const otp = generateOtp();
      user.set(setOtpDetails("emailVerification", otp));
      await user.save();

      await sendOtpEmail({
        toEmail: user.email,
        otp,
        purpose: "emailVerification",
      });

      return res.status(403).json({
        success: false,
        message: "Please verify your email first. OTP has been sent.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        gender: req.user.gender,
        role: req.user.role,
        profilePic: req.user.profilePic,
        isEmailVerified: req.user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, gender } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, gender },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        profilePic: user.profilePic,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error updating profile" });
  }
};

// POST /api/auth/verify-email-otp
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+emailVerificationOtpHash +emailVerificationOtpExpiresAt"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: "Email already verified",
        token,
        user: userResponse(user),
      });
    }

    const isExpired =
      !user.emailVerificationOtpExpiresAt ||
      user.emailVerificationOtpExpiresAt.getTime() < Date.now();
    if (isExpired) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    if (user.emailVerificationOtpHash !== hashOtp(String(otp))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.isActive = true;
    user.set(clearOtpDetails("emailVerification"));
    await user.save();

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error("verifyEmailOtp error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error verifying email" });
  }
};

// POST /api/auth/resend-email-otp
export const resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }

    const otp = generateOtp();
    user.set(setOtpDetails("emailVerification", otp));
    await user.save();

    await sendOtpEmail({
      toEmail: user.email,
      otp,
      purpose: "emailVerification",
    });

    return res.json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("resendEmailOtp error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error resending OTP" });
  }
};

// POST /api/auth/forgot-password/request-otp
export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({
        success: true,
        message: "If this email exists, OTP has been sent.",
      });
    }

    const otp = generateOtp();
    user.set(setOtpDetails("resetPassword", otp));
    await user.save();

    await sendOtpEmail({
      toEmail: user.email,
      otp,
      purpose: "passwordReset",
    });

    return res.json({
      success: true,
      message: "Password reset OTP sent",
    });
  } catch (error) {
    console.error("requestPasswordResetOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error sending password reset OTP",
    });
  }
};

// POST /api/auth/forgot-password/verify-otp
export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetPasswordOtpHash +resetPasswordOtpExpiresAt"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isExpired =
      !user.resetPasswordOtpExpiresAt ||
      user.resetPasswordOtpExpiresAt.getTime() < Date.now();
    if (isExpired) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    if (user.resetPasswordOtpHash !== hashOtp(String(otp))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    return res.json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    console.error("verifyPasswordResetOtp error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error verifying OTP" });
  }
};

// POST /api/auth/forgot-password/reset
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and newPassword are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password +resetPasswordOtpHash +resetPasswordOtpExpiresAt"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isExpired =
      !user.resetPasswordOtpExpiresAt ||
      user.resetPasswordOtpExpiresAt.getTime() < Date.now();
    if (isExpired) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    if (user.resetPasswordOtpHash !== hashOtp(String(otp))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    user.password = newPassword;
    user.set(clearOtpDetails("resetPassword"));
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }

    console.error("resetPasswordWithOtp error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error resetting password" });
  }
};

// POST /api/auth/admin/forgot-password/request-otp
export const requestAdminPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: "admin" });

    if (!user) {
      return res.json({
        success: true,
        message: "If this admin email exists, OTP has been sent.",
      });
    }

    const otp = generateOtp();
    user.set(setOtpDetails("resetPassword", otp));
    await user.save();

    await sendOtpEmail({
      toEmail: user.email,
      otp,
      purpose: "passwordReset",
    });

    return res.json({
      success: true,
      message: "Admin password reset OTP sent",
    });
  } catch (error) {
    console.error("requestAdminPasswordResetOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error sending admin password reset OTP",
    });
  }
};

// POST /api/auth/admin/forgot-password/verify-otp
export const verifyAdminPasswordResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await findUserForPasswordReset({
      email,
      adminOnly: true,
      withSensitive: false,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found" });
    }

    const isExpired =
      !user.resetPasswordOtpExpiresAt ||
      user.resetPasswordOtpExpiresAt.getTime() < Date.now();
    if (isExpired) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    if (user.resetPasswordOtpHash !== hashOtp(String(otp))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    return res.json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    console.error("verifyAdminPasswordResetOtp error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error verifying admin OTP" });
  }
};

// POST /api/auth/admin/forgot-password/reset
export const resetAdminPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and newPassword are required",
      });
    }

    const user = await findUserForPasswordReset({
      email,
      adminOnly: true,
      withSensitive: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found" });
    }

    const isExpired =
      !user.resetPasswordOtpExpiresAt ||
      user.resetPasswordOtpExpiresAt.getTime() < Date.now();
    if (isExpired) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    if (user.resetPasswordOtpHash !== hashOtp(String(otp))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    user.password = newPassword;
    user.set(clearOtpDetails("resetPassword"));
    await user.save();

    return res.json({
      success: true,
      message: "Admin password reset successful",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }

    console.error("resetAdminPasswordWithOtp error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error resetting admin password" });
  }
};
