const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ip: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
