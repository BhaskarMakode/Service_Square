require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");
const ProviderProfile = require("./models/ProviderProfile");

const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/localconnect";

const MOCK_CATEGORIES = [
  { name: "Plumbing", description: "Expert plumbing services for your home", icon: "plumbing" },
  { name: "Cleaning", description: "Professional home and office cleaning", icon: "cleaning_services" },
  { name: "Electrical", description: "Safe and reliable electrical work", icon: "electrical_services" },
  { name: "Carpentry", description: "Custom furniture and woodwork", icon: "handyman" },
  { name: "Painting", description: "Interior and exterior painting", icon: "format_paint" },
  { name: "Pest Control", description: "Effective pest elimination", icon: "pest_control" }
];

const MOCK_LOCATIONS = [
  // Mumbai area
  { type: "Point", coordinates: [72.8777, 19.0760], address: "Andheri West, Mumbai" },
  { type: "Point", coordinates: [72.8258, 18.9220], address: "Colaba, Mumbai" },
  { type: "Point", coordinates: [72.9091, 19.1235], address: "Powai, Mumbai" },
  // Delhi area
  { type: "Point", coordinates: [77.2090, 28.6139], address: "Connaught Place, Delhi" },
  { type: "Point", coordinates: [77.1025, 28.7041], address: "Rohini, Delhi" },
  { type: "Point", coordinates: [77.2167, 28.5273], address: "Saket, Delhi" }
];

const MOCK_NAMES = [
  "Rahul Sharma", "Amit Patel", "Sneha Gupta", "Vikram Singh",
  "Pooja Verma", "Suresh Kumar", "Ramesh Joshi", "Anil Desai",
  "Riya Sen", "Arjun Reddy", "Neha Kapoor", "Mohan Das"
];

async function seed() {
  try {
    console.log("Connecting to Database:", DB_URI);
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    console.log("Clearing existing dummy data...");
    
    // We don't want to wipe the real admin users, so we'll just delete those created by script (or just wipe all providers/categories for testing if needed)
    // Actually, just deleting specific providers might be safer. Let's just clear all Providers for a fresh slate
    await ProviderProfile.deleteMany({});
    console.log("Cleared old providers.");

    // Upsert Categories
    const categoriesMap = {};
    for (const catData of MOCK_CATEGORIES) {
      let cat = await Category.findOne({ name: catData.name });
      if (!cat) {
        cat = await Category.create(catData);
      }
      categoriesMap[cat.name] = cat;
    }
    console.log("Categories ready.");

    // Create Dummy Providers
    for (let i = 0; i < 12; i++) {
      const name = MOCK_NAMES[i];
      const phone = `+9199999${10000 + i}`;
      
      let user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({
          name: name,
          phone: phone,
          role: "provider",
          email: `provider${i}@example.com`,
          isVerified: true
        });
      }

      const catName = MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name;
      const category = categoriesMap[catName];
      const location = MOCK_LOCATIONS[i % MOCK_LOCATIONS.length];

      await ProviderProfile.create({
        userId: user._id,
        category: category.slug,
        categoryId: category._id,
        skills: [catName, "Home Service", "Expert"],
        bio: `Hi, I am ${name}. I have years of experience in ${catName}. I provide high quality service at reasonable rates.`,
        hourlyRate: 300 + (Math.floor(Math.random() * 8) * 100), // Random rate between 300 and 1000
        experience: 2 + Math.floor(Math.random() * 10),
        rating: 4.0 + (Math.random() * 1.0),
        reviewsCount: 10 + Math.floor(Math.random() * 100),
        availabilityStatus: "available",
        address: location.address,
        location: {
          type: "Point",
          coordinates: location.coordinates
        },
        verificationStatus: "approved",
        verifiedAt: new Date(),
        isPremium: i % 3 === 0, // 1/3rd are premium
        services: [
          {
            title: `Basic ${catName} Service`,
            description: `A standard visit to inspect and fix basic ${catName.toLowerCase()} issues.`,
            price: 299,
            duration: 60,
            isActive: true
          },
          {
            title: `Advanced ${catName} Repair`,
            description: `Comprehensive check and repair for complex problems.`,
            price: 899,
            duration: 120,
            isActive: true
          }
        ]
      });
    }

    console.log("Successfully seeded 12 dummy providers.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
