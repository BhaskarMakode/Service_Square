const mongoose = require("mongoose");

const liveLocationSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
      unique: true,
      index: true
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
    updatedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

liveLocationSchema.index({ location: "2dsphere" });
liveLocationSchema.index({ updatedAt: -1 });

module.exports = mongoose.model("LiveLocation", liveLocationSchema);
