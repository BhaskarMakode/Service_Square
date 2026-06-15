const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

chatMessageSchema.index({ bookingId: 1, timestamp: -1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
