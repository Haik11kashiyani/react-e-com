import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      match: [/^[A-Za-z\s]+$/, "First name must contain only letters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      match: [/^[A-Za-z\s]+$/, "Last name must contain only letters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9]+.+[a-zA-Z]{2,4}$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: [10, "Phone number must be at least 10 digits"],
      match: [/^[0-9]+$/, "Phone number must contain only digits"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      ],
    },
    profilePic: {
      type: String, // URL to the uploaded file
      default: null,
    },
    profilePicPublicId: {
      type: String, // For file deletion if using cloud storage
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    agreeTerms: {
      type: Boolean,
      required: [true, "You must agree to the terms and conditions"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
