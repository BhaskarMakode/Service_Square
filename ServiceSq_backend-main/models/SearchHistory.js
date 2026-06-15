const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    searchedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

searchHistorySchema.index({ userId: 1, searchedAt: -1 });
searchHistorySchema.index({ userId: 1, keyword: 1 }, { unique: true });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
