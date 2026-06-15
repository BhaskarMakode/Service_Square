const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    houseNo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    street: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 12,
      index: true
    },
    landmark: {
      type: String,
      trim: true,
      maxlength: 160
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

addressSchema.index(
  { userId: 1, isDefault: 1 },
  {
    unique: true,
    partialFilterExpression: { isDefault: true }
  }
);
addressSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Address", addressSchema);
