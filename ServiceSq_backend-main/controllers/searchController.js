const Booking = require("../models/Booking");
const ProviderProfile = require("../models/ProviderProfile");
const SearchHistory = require("../models/SearchHistory");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { toNumber } = require("../utils/location");
const { buildPagination, getPagination } = require("../utils/pagination");
const slugify = require("../utils/slugify");
const {
  getSearchHistoryLimit,
  recordSearch
} = require("../services/searchHistoryService");

const availabilityStages = [
  {
    $lookup: {
      from: "availabilities",
      localField: "_id",
      foreignField: "providerId",
      as: "availability"
    }
  },
  { $unwind: "$availability" },
  {
    $match: {
      "availability.isOnline": true,
      "availability.isAvailable": true
    }
  }
];

const publicLookupStages = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      __v: 0,
      "user.phone": 0,
      "user.email": 0,
      "user.__v": 0
    }
  }
];

const buildProviderMatch = (query) => {
  const match = {
    verificationStatus: "approved",
    availabilityStatus: "available"
  };

  if (query.category) match.category = slugify(query.category);
  if (query.minRating !== undefined) match.rating = { $gte: Number(query.minRating) };
  if (query.maxPrice !== undefined) match.hourlyRate = { $lte: Number(query.maxPrice) };

  return match;
};

const searchProviders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const latitude = toNumber(req.query.latitude);
  const longitude = toNumber(req.query.longitude);
  const radiusKm = toNumber(req.query.radius) || 10;
  const q = req.query.q && String(req.query.q).trim();
  const match = buildProviderMatch(req.query);
  const pipeline = [];

  if (req.user && q) {
    await recordSearch({
      userId: req.user._id,
      keyword: q
    });
  }

  if (latitude !== undefined && longitude !== undefined) {
    pipeline.push({
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "distanceMeters",
        maxDistance: radiusKm * 1000,
        spherical: true,
        query: match
      }
    });
    pipeline.push({
      $addFields: {
        distanceKm: { $round: [{ $divide: ["$distanceMeters", 1000] }, 2] }
      }
    });
  } else {
    if (q) {
      match.$text = { $search: q };
    }
    pipeline.push({ $match: match });
    if (q) {
      pipeline.push({ $addFields: { textScore: { $meta: "textScore" } } });
    }
  }

  if (q && latitude !== undefined && longitude !== undefined) {
    const regex = new RegExp(q, "i");
    pipeline.push({
      $match: {
        $or: [{ category: regex }, { skills: regex }, { address: regex }]
      }
    });
  }

  pipeline.push(...availabilityStages);
  pipeline.push({
    $sort:
      latitude !== undefined && longitude !== undefined
        ? { distanceMeters: 1, rating: -1, reviewsCount: -1 }
        : { textScore: -1, rating: -1, reviewsCount: -1 }
  });
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      providers: [{ $skip: skip }, { $limit: limit }, ...publicLookupStages]
    }
  });

  const [result = { metadata: [], providers: [] }] = await ProviderProfile.aggregate(pipeline);
  const total = result.metadata[0] ? result.metadata[0].total : 0;

  return sendSuccess(res, 200, "Providers search completed successfully.", {
    providers: result.providers,
    pagination: buildPagination({ page, limit, total })
  });
});

const getTrendingProviders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [result = { metadata: [], providers: [] }] = await ProviderProfile.aggregate([
    {
      $match: {
        verificationStatus: "approved",
        availabilityStatus: "available"
      }
    },
    ...availabilityStages,
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "providerId",
        as: "bookings"
      }
    },
    {
      $addFields: {
        completedBookings: {
          $size: {
            $filter: {
              input: "$bookings",
              as: "booking",
              cond: { $eq: ["$$booking.status", "completed"] }
            }
          }
        },
        trendScore: {
          $add: [{ $multiply: ["$rating", 10] }, "$reviewsCount", { $size: "$bookings" }]
        }
      }
    },
    { $sort: { trendScore: -1, rating: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        providers: [{ $skip: skip }, { $limit: limit }, ...publicLookupStages]
      }
    }
  ]);

  const total = result.metadata[0] ? result.metadata[0].total : 0;

  return sendSuccess(res, 200, "Trending providers fetched successfully.", {
    providers: result.providers,
    pagination: buildPagination({ page, limit, total })
  });
});

const getRecommendedProviders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const bookings = await Booking.find({ customerId: req.user._id }).select("serviceType");
  const categories = [...new Set(bookings.map((booking) => booking.serviceType))];
  const match = {
    verificationStatus: "approved",
    availabilityStatus: "available"
  };

  if (categories.length > 0) {
    match.category = { $in: categories };
  }

  const [result = { metadata: [], providers: [] }] = await ProviderProfile.aggregate([
    { $match: match },
    ...availabilityStages,
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "providerId",
        as: "bookings"
      }
    },
    {
      $addFields: {
        recommendationScore: {
          $add: [{ $multiply: ["$rating", 10] }, "$reviewsCount", { $multiply: [{ $size: "$bookings" }, 2] }]
        }
      }
    },
    { $sort: { recommendationScore: -1, rating: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        providers: [{ $skip: skip }, { $limit: limit }, ...publicLookupStages]
      }
    }
  ]);

  const total = result.metadata[0] ? result.metadata[0].total : 0;

  return sendSuccess(res, 200, "Recommended providers fetched successfully.", {
    providers: result.providers,
    pagination: buildPagination({ page, limit, total })
  });
});

const getSearchHistory = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 10), getSearchHistoryLimit(), 50);
  const searches = await SearchHistory.find({ userId: req.user._id }).sort({ searchedAt: -1 }).limit(limit);

  return sendSuccess(res, 200, "Search history fetched successfully.", {
    searches
  });
});

const clearSearchHistory = asyncHandler(async (req, res) => {
  await SearchHistory.deleteMany({ userId: req.user._id });

  return sendSuccess(res, 200, "Search history cleared successfully.", {
    searches: []
  });
});

module.exports = {
  clearSearchHistory,
  getRecommendedProviders,
  getSearchHistory,
  getTrendingProviders,
  searchProviders
};
