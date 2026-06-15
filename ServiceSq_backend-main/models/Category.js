const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    icon: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
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

categorySchema.pre("validate", function buildSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }

  if (this.slug) {
    this.slug = slugify(this.slug);
  }

  next();
});

module.exports = mongoose.model("Category", categorySchema);
