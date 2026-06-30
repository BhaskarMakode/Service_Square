process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";
process.env.SEARCH_HISTORY_LIMIT = "2";
process.env.UPLOAD_DIR = "test-uploads";

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

const app = require("../app");
const Address = require("../models/Address");
const Availability = require("../models/Availability");
const Booking = require("../models/Booking");
const LiveLocation = require("../models/LiveLocation");
const ProviderProfile = require("../models/ProviderProfile");
const SearchHistory = require("../models/SearchHistory");
const User = require("../models/User");

let mongo;
let phoneCounter = 1000000000;

const createUser = async (overrides = {}) => {
  phoneCounter += 1;

  return User.create({
    name: overrides.name || "Test User",
    phone: overrides.phone || `+91${phoneCounter}`,
    role: overrides.role || "customer",
    email: overrides.email,
    isVerified: true,
    isActive: true,
    ...overrides
  });
};

const tokenFor = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      phone: user.phone
    },
    process.env.JWT_SECRET
  );
};

const auth = (user) => `Bearer ${tokenFor(user)}`;

const createProviderProfile = async (user, overrides = {}) => {
  return ProviderProfile.create({
    userId: user._id,
    category: "electrician",
    skills: ["wiring", "fan repair"],
    hourlyRate: 500,
    experience: 5,
    address: "Indiranagar, Bengaluru",
    location: {
      type: "Point",
      coordinates: [77.6412, 12.9719]
    },
    verificationStatus: "approved",
    ...overrides
  });
};

beforeAll(async () => {
  // Check if already connected (from setup.js)
  if (mongoose.connection.readyState === 0) {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  }
  await Promise.all([
    Address.syncIndexes(),
    LiveLocation.syncIndexes(),
    ProviderProfile.syncIndexes(),
    SearchHistory.syncIndexes()
  ]);
});

afterEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  // Only disconnect if mongo was created in this test file
  if (mongo) {
    await mongoose.disconnect();
    await mongo.stop();
  }
  fs.rmSync(path.resolve(__dirname, "..", "test-uploads"), { recursive: true, force: true });
});

describe("Expanded APIs", () => {
  it("keeps only one default address per user", async () => {
    const user = await createUser();
    const baseAddress = {
      fullName: "Amit Sharma",
      phone: "+919876543210",
      houseNo: "221B",
      street: "MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001"
    };

    await request(app)
      .post("/api/addresses/add")
      .set("Authorization", auth(user))
      .send({ ...baseAddress, isDefault: false })
      .expect(201);

    await request(app)
      .post("/api/addresses/add")
      .set("Authorization", auth(user))
      .send({ ...baseAddress, houseNo: "44", isDefault: true })
      .expect(201);

    const response = await request(app).get("/api/addresses").set("Authorization", auth(user)).expect(200);
    const defaults = response.body.data.addresses.filter((address) => address.isDefault);

    expect(defaults).toHaveLength(1);
    expect(defaults[0].houseNo).toBe("44");
  });

  it("generates completed booking invoices and blocks unrelated users", async () => {
    const customer = await createUser({ role: "customer" });
    const otherCustomer = await createUser({ role: "customer" });
    const providerUser = await createUser({ role: "provider" });
    const provider = await createProviderProfile(providerUser);
    const booking = await Booking.create({
      customerId: customer._id,
      providerId: provider._id,
      serviceType: "electrician",
      bookingDate: new Date("2026-05-12T09:00:00.000Z"),
      scheduledStart: new Date("2026-05-12T09:00:00.000Z"),
      scheduledEnd: new Date("2026-05-12T11:00:00.000Z"),
      address: "221B MG Road, Bengaluru",
      amount: 1000,
      status: "completed",
      paymentStatus: "paid"
    });

    const invoiceResponse = await request(app)
      .get(`/api/invoices/${booking._id}`)
      .set("Authorization", auth(customer))
      .expect(200);

    expect(invoiceResponse.body.data.invoice.invoiceNumber).toMatch(/^LC-INV-/);
    expect(invoiceResponse.body.data.invoice.totalAmount).toBe(1000);

    await request(app)
      .get(`/api/invoices/${booking._id}`)
      .set("Authorization", auth(otherCustomer))
      .expect(403);
  });

  it("requires admin access for analytics", async () => {
    const customer = await createUser({ role: "customer" });
    const admin = await createUser({ role: "admin" });

    await request(app).get("/api/analytics/users").set("Authorization", auth(customer)).expect(403);

    const response = await request(app).get("/api/analytics/users").set("Authorization", auth(admin)).expect(200);

    expect(response.body.data.activeUsers).toBeGreaterThanOrEqual(2);
  });

  it("prevents duplicate open reports", async () => {
    const reporter = await createUser({ role: "customer" });
    const target = await createUser({ role: "customer" });
    const payload = {
      targetUser: target._id.toString(),
      reason: "abusive_behavior",
      description: "Used abusive language."
    };

    await request(app).post("/api/report/user").set("Authorization", auth(reporter)).send(payload).expect(201);
    await request(app).post("/api/report/user").set("Authorization", auth(reporter)).send(payload).expect(409);
  });

  it("upgrades provider subscriptions and reports active status", async () => {
    const providerUser = await createUser({ role: "provider" });
    await createProviderProfile(providerUser);

    await request(app)
      .post("/api/subscription/upgrade")
      .set("Authorization", auth(providerUser))
      .send({ planName: "premium_monthly", paymentMethod: "mock" })
      .expect(201);

    const response = await request(app)
      .get("/api/subscription/status")
      .set("Authorization", auth(providerUser))
      .expect(200);

    expect(response.body.data.active).toBe(true);
    expect(response.body.data.premiumBadge).toBe(true);
  });

  it("uploads KYC documents and lets admins review them", async () => {
    const providerUser = await createUser({ role: "provider" });
    const admin = await createUser({ role: "admin" });
    await createProviderProfile(providerUser, { verificationStatus: "rejected" });

    const uploadResponse = await request(app)
      .post("/api/verification/upload")
      .set("Authorization", auth(providerUser))
      .field("documentType", "aadhaar")
      .attach("document", Buffer.from("%PDF-1.4\n"), {
        filename: "aadhaar.pdf",
        contentType: "application/pdf"
      })
      .expect(201);

    const verificationId = uploadResponse.body.data.verification._id;

    const reviewResponse = await request(app)
      .put(`/api/admin/verification/${verificationId}`)
      .set("Authorization", auth(admin))
      .send({ status: "approved" })
      .expect(200);

    expect(reviewResponse.body.data.verification.verificationStatus).toBe("approved");
    expect(reviewResponse.body.data.provider.verificationStatus).toBe("approved");
  });

  it("updates and fetches provider live location with distance", async () => {
    const providerUser = await createUser({ role: "provider" });
    const customer = await createUser({ role: "customer" });
    const provider = await createProviderProfile(providerUser);

    await request(app)
      .put("/api/location/update")
      .set("Authorization", auth(providerUser))
      .send({ latitude: 12.9719, longitude: 77.6412 })
      .expect(200);

    const response = await request(app)
      .get(`/api/location/provider/${provider._id}?latitude=12.9719&longitude=77.6412`)
      .set("Authorization", auth(customer))
      .expect(200);

    expect(response.body.data.liveLocation.location.coordinates).toEqual([77.6412, 12.9719]);
    expect(response.body.data.distanceKm).toBe(0);
  });

  it("auto-records and trims authenticated search history", async () => {
    const customer = await createUser({ role: "customer" });

    await request(app)
      .get("/api/search/providers?q=fan&latitude=12.9719&longitude=77.6412")
      .set("Authorization", auth(customer))
      .expect(200);
    await request(app)
      .get("/api/search/providers?q=plumber&latitude=12.9719&longitude=77.6412")
      .set("Authorization", auth(customer))
      .expect(200);
    await request(app)
      .get("/api/search/providers?q=cleaning&latitude=12.9719&longitude=77.6412")
      .set("Authorization", auth(customer))
      .expect(200);

    const response = await request(app)
      .get("/api/search/history")
      .set("Authorization", auth(customer))
      .expect(200);

    expect(response.body.data.searches.map((item) => item.keyword)).toEqual(["cleaning", "plumber"]);
  });

  it("allows fetching slots for duration under 30 minutes", async () => {
    const providerUser = await createUser({ role: "provider" });
    const provider = await createProviderProfile(providerUser, { verificationStatus: "approved", availabilityStatus: "available" });
    
    await Availability.create({
      providerId: provider._id,
      isOnline: true,
      isAvailable: true,
      workingHours: [
        { day: "monday", startTime: "09:00", endTime: "18:00" },
        { day: "tuesday", startTime: "09:00", endTime: "18:00" },
        { day: "wednesday", startTime: "09:00", endTime: "18:00" },
        { day: "thursday", startTime: "09:00", endTime: "18:00" },
        { day: "friday", startTime: "09:00", endTime: "18:00" },
        { day: "saturday", startTime: "09:00", endTime: "18:00" },
        { day: "sunday", startTime: "09:00", endTime: "18:00" }
      ]
    });

    const response = await request(app)
      .get(`/api/availability/provider/${provider._id}/slots?date=2026-07-01&durationMinutes=22`)
      .expect(200);

    expect(response.body.data.slots.length).toBeGreaterThan(0);
    expect(response.body.data.durationMinutes).toBe(22);
  });
});
