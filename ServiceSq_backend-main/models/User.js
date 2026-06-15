const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 80
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer",
      index: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true
    },
    avatar: {
      type: String,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  const user = this.toObject();
  delete user.__v;
  return user;
};

module.exports = mongoose.model("User", userSchema);
