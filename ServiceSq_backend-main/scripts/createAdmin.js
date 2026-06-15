require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const normalizePhone = require("../utils/normalizePhone");

const createAdmin = async () => {
  await connectDB();

  const phone = normalizePhone(process.env.ADMIN_PHONE);

  if (!phone) {
    throw new Error("ADMIN_PHONE is required.");
  }

  const admin = await User.findOneAndUpdate(
    { phone },
    {
      name: process.env.ADMIN_NAME || "LocalConnect Admin",
      email: process.env.ADMIN_EMAIL || undefined,
      phone,
      role: "admin",
      isVerified: true,
      isActive: true,
      deletedAt: null
    },
    { new: true, upsert: true, runValidators: true }
  );

  console.log(`Admin ready: ${admin.phone} (${admin.email || "no email"})`);
};

createAdmin()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
