const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true
    },
    skills: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
      index: true
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500
    },
    isPremium: {
      type: Boolean,
      default: false,
      index: true
    },
    premiumUntil: {
      type: Date,
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Required for MongoDB $near/$geoNear radius queries.
providerProfileSchema.index({ location: "2dsphere" });
providerProfileSchema.index({ category: 1, rating: -1, hourlyRate: 1 });
providerProfileSchema.index({
  category: "text",
  skills: "text",
  address: "text"
});

module.exports = mongoose.model("ProviderProfile", providerProfileSchema);
