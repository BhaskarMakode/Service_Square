require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const ProviderProfile = require("./models/ProviderProfile");
const Booking = require("./models/Booking");
const Category = require("./models/Category");

const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/localconnect";

async function seedData() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB.");

    // Create a Customer User
    const customer = await User.findOneAndUpdate(
      { phone: "+918888888888" },
      {
        name: "Power Customer",
        email: "customer@test.com",
        phone: "+918888888888",
        role: "customer",
        isVerified: true
      },
      { new: true, upsert: true }
    );
    console.log("Created customer:", customer.name);

    // Get an active provider
    let providerProfile = await ProviderProfile.findOne({}).populate("userId");
    if (!providerProfile) {
      console.log("No provider found to assign bookings to. Please run seed script first.");
      process.exit(1);
    }
    
    // Update Provider Name
    await User.findByIdAndUpdate(providerProfile.userId._id, { name: "Power Provider" });
    console.log("Using provider:", "Power Provider");

    // Create many bookings (Past and Upcoming)
    const statuses = ["completed", "completed", "completed", "completed", "accepted", "pending", "cancelled"];
    
    await Booking.deleteMany({ customerId: customer._id });

    for (let i = 0; i < 10; i++) {
      const isPast = i < 4;
      const status = statuses[i % statuses.length];
      
      const date = new Date();
      if (isPast) {
        date.setDate(date.getDate() - (Math.floor(Math.random() * 10) + 1));
      } else {
        date.setDate(date.getDate() + (Math.floor(Math.random() * 10) + 1));
      }
      
      date.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(date.getHours() + 2);

      await Booking.create({
        customerId: customer._id,
        providerId: providerProfile._id,
        serviceType: providerProfile.category,
        scheduledStart: date,
        scheduledEnd: endDate,
        address: "123 Customer Street, NY",
        location: {
          type: "Point",
          coordinates: [77.4126, 23.2599]
        },
        status: status,
        amount: providerProfile.hourlyRate * 2 + 50,
        paymentStatus: status === "completed" ? "paid" : "pending",
        paymentMethod: "cash",
        notes: "Please arrive on time."
      });
    }

    console.log("Successfully created 10 bookings between Power Customer and Power Provider!");
    console.log("\n--- CUSTOMER LOGIN ---");
    console.log("Phone: +918888888888 (OTP: 123456)");
    
    console.log("\n--- PROVIDER LOGIN ---");
    console.log("Phone:", providerProfile.userId.phone, "(OTP: 123456)");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedData();
