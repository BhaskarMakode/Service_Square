const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
      index: true
    },
    planName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "expired"],
      default: "pending",
      index: true
    },
    features: {
      type: [String],
      default: []
    },
    paymentMethod: {
      type: String,
      enum: ["mock", "card", "upi", "razorpay", "stripe"],
      default: "mock"
    },
    paymentReference: {
      type: String,
      trim: true,
      sparse: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

subscriptionSchema.index({ providerId: 1, paymentStatus: 1, expiryDate: -1 });

module.exports = mongoose.model("Subscription", subscriptionSchema);
