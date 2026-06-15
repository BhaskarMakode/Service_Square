const mongoose = require("mongoose");

const workingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      required: true
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/
    }
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
      unique: true,
      index: true
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true
    },
    isAvailable: {
      type: Boolean,
      default: false,
      index: true
    },
    workingHours: {
      type: [workingHourSchema],
      default: []
    },
    lastActive: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

availabilitySchema.index({ isOnline: 1, isAvailable: 1, lastActive: -1 });

module.exports = mongoose.model("Availability", availabilitySchema);
