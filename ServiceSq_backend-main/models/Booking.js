const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
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
    serviceType: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    bookingDate: {
      type: Date,
      required: true,
      index: true
    },
    scheduledStart: {
      type: Date,
      required: true,
      index: true
    },
    scheduledEnd: {
      type: Date,
      required: true,
      index: true
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "razorpay", "mock"],
      default: "cash",
      index: true
    },
    cashCollectedAt: {
      type: Date,
      default: null
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [77.4126, 23.2599] // [longitude, latitude]
      }
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ location: "2dsphere" });

bookingSchema.index({
  providerId: 1,
  status: 1,
  scheduledStart: 1,
  scheduledEnd: 1
});

bookingSchema.pre("validate", function validateSchedule(next) {
  if (this.scheduledStart && this.scheduledEnd && this.scheduledStart >= this.scheduledEnd) {
    this.invalidate("scheduledEnd", "scheduledEnd must be after scheduledStart.");
  }

  if (!this.bookingDate && this.scheduledStart) {
    this.bookingDate = this.scheduledStart;
  }

  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
