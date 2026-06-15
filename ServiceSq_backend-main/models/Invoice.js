const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
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
    taxes: {
      type: Number,
      default: 0,
      min: 0
    },
    platformFee: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded"],
      default: "unpaid",
      index: true
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    generatedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true
    },
    lineItems: {
      type: [
        {
          label: { type: String, required: true, trim: true },
          amount: { type: Number, required: true, min: 0 }
        }
      ],
      default: []
    },
    customerSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    providerSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    bookingSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

invoiceSchema.index({ customerId: 1, generatedAt: -1 });
invoiceSchema.index({ providerId: 1, generatedAt: -1 });

module.exports = mongoose.model("Invoice", invoiceSchema);
