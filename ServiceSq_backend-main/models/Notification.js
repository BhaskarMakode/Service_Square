const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    type: {
      type: String,
      enum: ["booking_created", "booking_accepted", "booking_rejected", "booking_completed", "payment_received"],
      required: true,
      index: true
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    relatedResourceType: {
      type: String,
      trim: true
    },
    relatedResourceId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
