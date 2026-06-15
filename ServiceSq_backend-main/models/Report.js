const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    targetProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      index: true
    },
    targetType: {
      type: String,
      enum: ["user", "provider"],
      required: true,
      index: true
    },
    reason: {
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
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "action_taken"],
      default: "pending",
      index: true
    },
    adminAction: {
      type: String,
      enum: ["none", "warning", "suspended", "dismissed", "other"],
      default: "none",
      index: true
    },
    actionNote: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    actionedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    actionedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ reportedBy: 1, targetUser: 1, targetType: 1, status: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
