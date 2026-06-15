const Booking = require("../models/Booking");
const ProviderProfile = require("../models/ProviderProfile");
const Review = require("../models/Review");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { refreshProviderRating } = require("../services/providerRatingService");

const addReview = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.body.bookingId);

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.customerId.toString() !== req.user._id.toString()) {
    throw new AppError("You can only review your own bookings.", 403);
  }

  if (booking.status !== "completed") {
    throw new AppError("Reviews can only be added after a completed booking.", 400);
  }

  if (req.body.providerId && req.body.providerId !== booking.providerId.toString()) {
    throw new AppError("providerId does not match the booking provider.", 400);
  }

  const existingReview = await Review.findOne({ bookingId: booking._id });

  if (existingReview) {
    throw new AppError("A review already exists for this booking.", 409);
  }

  const review = await Review.create({
    bookingId: booking._id,
    customerId: req.user._id,
    providerId: booking.providerId,
    rating: Number(req.body.rating),
    comment: req.body.comment
  });

  await refreshProviderRating(booking.providerId);
  await review.populate("customerId", "name avatar");

  return sendSuccess(res, 201, "Review added successfully.", {
    review
  });
});

const getProviderReviews = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.params.providerId).select("_id rating reviewsCount");

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 10), 100);
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ providerId: provider._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("customerId", "name avatar"),
    Review.countDocuments({ providerId: provider._id })
  ]);

  return sendSuccess(res, 200, "Provider reviews fetched successfully.", {
    provider,
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

module.exports = {
  addReview,
  getProviderReviews
};
