const mongoose = require("mongoose");
const ProviderProfile = require("../models/ProviderProfile");
const Review = require("../models/Review");

const refreshProviderRating = async (providerId) => {
  const [stats] = await Review.aggregate([
    {
      $match: {
        providerId: new mongoose.Types.ObjectId(providerId)
      }
    },
    {
      $group: {
        _id: "$providerId",
        rating: { $avg: "$rating" },
        reviewsCount: { $sum: 1 }
      }
    }
  ]);

  await ProviderProfile.findByIdAndUpdate(providerId, {
    rating: stats ? Number(stats.rating.toFixed(2)) : 0,
    reviewsCount: stats ? stats.reviewsCount : 0
  });
};

module.exports = {
  refreshProviderRating
};
