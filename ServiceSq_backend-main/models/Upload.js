const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      index: true
    },
    type: {
      type: String,
      enum: ["profile_image", "document", "portfolio_image", "verification_document"],
      required: true,
      index: true
    },
    documentType: {
      type: String,
      trim: true
    },
    originalName: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    storageProvider: {
      type: String,
      enum: ["local", "cloudinary"],
      default: "local"
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

uploadSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Upload", uploadSchema);
