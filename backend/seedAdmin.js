import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "process";
import bcrypt from "bcryptjs";
import User from "./models/Users.js";

dotenv.config();

const ADMIN_EMAIL = "projectbcaall@gmail.com";
const ADMIN_PASSWORD = "admin@123";

async function seedAdmin() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/db_techorbit";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const existing = await User.collection.findOne({ email: ADMIN_EMAIL });

    await User.collection.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          firstName: "Admin",
          lastName: "TechOrbit",
          email: ADMIN_EMAIL,
          phone: "9999999999",
          gender: "male",
          password: passwordHash,
          role: "admin",
          isActive: true,
          isEmailVerified: true,
          agreeTerms: true,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    if (existing) {
      console.log("✓ Admin user already existed and is now updated!");
    } else {
      console.log("✓ Admin user created successfully!");
    }

    const admin = await User.findOne({ email: ADMIN_EMAIL });
    console.log("  ─────────────────────────────");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
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
