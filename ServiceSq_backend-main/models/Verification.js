const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
      index: true
    },
    documentType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    documentImage: {
      url: { type: String, required: true, trim: true },
      uploadId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload" },
      originalName: { type: String, trim: true },
      mimeType: { type: String, trim: true },
      size: { type: Number, min: 0 },
      storageProvider: {
        type: String,
        enum: ["local", "cloudinary"],
        default: "local"
      },
      publicId: { type: String, trim: true }
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

verificationSchema.index({ providerId: 1, submittedAt: -1 });
verificationSchema.index({ verificationStatus: 1, submittedAt: -1 });

module.exports = mongoose.model("Verification", verificationSchema);
