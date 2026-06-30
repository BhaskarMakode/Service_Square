require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/localconnect";

async function createAdmin() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB.");

    const adminPhone = "+919999999999";
    const adminData = {
      name: "Super Admin",
      phone: adminPhone,
      email: "superadmin@servicesquare.com",
      role: "admin",
      isVerified: true
    };

    let admin = await User.findOne({ phone: adminPhone });
    if (admin) {
      admin.role = "admin";
      admin.name = adminData.name;
      admin.isVerified = true;
      await admin.save();
      console.log("Updated existing user to admin.");
    } else {
      admin = await User.create(adminData);
      console.log("Created new admin user.");
    }

    console.log("\n--- ADMIN CREDENTIALS ---");
    console.log("Phone Number:", adminPhone);
    console.log("OTP: (The system typically expects 123456 or 1234 in dev mode, depending on your auth setup)");
    console.log("-------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
