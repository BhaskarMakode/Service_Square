const mongoose = require("mongoose");

const portfolioImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    uploadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload"
    },
    originalName: {
      type: String,
      trim: true
    },
    mimeType: {
      type: String,
      trim: true
    },
    size: {
      type: Number,
      min: 0
    },
    storageProvider: {
      type: String,
      enum: ["local", "cloudinary"],
      default: "local"
    },
    publicId: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    images: {
      type: [portfolioImageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

portfolioSchema.index({ providerId: 1, createdAt: -1 });

module.exports = mongoose.model("Portfolio", portfolioSchema);
