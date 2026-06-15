const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    issue: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true
    }
  },
  {
    timestamps: true
  }
);

supportTicketSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
