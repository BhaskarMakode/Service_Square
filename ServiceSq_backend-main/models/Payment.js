const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
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
    paymentMethod: {
      type: String,
      enum: ["mock", "card", "upi", "cash", "razorpay", "stripe"],
      default: "mock"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
      index: true
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    clientSecretHash: {
      type: String,
      required: true
    },
    transactionId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true
    },
    commissionAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    providerEarning: {
      type: Number,
      default: 0,
      min: 0
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    failureReason: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ customerId: 1, createdAt: -1 });
paymentSchema.index({ providerId: 1, paymentStatus: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
