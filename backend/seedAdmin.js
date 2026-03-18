import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "process";
import User from "./models/Users.js";

dotenv.config();

async function seedAdmin() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/db_techorbit";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@techorbit.com" });
    if (existing) {
      console.log("✓ Admin user already exists!");
      console.log("  Email:    admin@techorbit.com");
      console.log("  Password: Admin@123");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      firstName: "Admin",
      lastName: "TechOrbit",
      email: "admin@techorbit.com",
      phone: "9999999999",
      gender: "male",
      password: "Admin@123",
      role: "admin",
      isActive: true,
      agreeTerms: true,
    });

    console.log("\n✓ Admin user created successfully!");
    console.log("  ─────────────────────────────");
    console.log("  Email:    admin@techorbit.com");
    console.log("  Password: Admin@123");
    console.log("  Role:     admin");
    console.log("  ID:       " + admin._id);
    console.log("  ─────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("Seed admin error:", error);
    process.exit(1);
  }
}

seedAdmin();
