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

// ✅ FIX: Left outer join — providers WITHOUT an availability record are still shown.
// Previously used $unwind which silently dropped new approved providers.
const availabilityStages = [
  {
    $lookup: {
      from: "availabilities",
      localField: "_id",
      foreignField: "providerId",
      as: "availabilityArr"
    }
  },
  {
    $addFields: {
      availability: { $ifNull: [{ $arrayElemAt: ["$availabilityArr", 0] }, {}] }
    }
  },
  {
    $unset: "availabilityArr"
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
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "categoryDetails"
    }
  },
  { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      __v: 0,
      "user.phone": 0,
      "user.email": 0,
      "user.__v": 0,
      "categoryDetails.__v": 0
    }
  }
];

const buildProviderMatch = (query) => {
  // Always only show approved providers
  const match = { verificationStatus: "approved" };

  // Only filter by availabilityStatus if explicitly passed and not empty
  if (query.availabilityStatus && query.availabilityStatus !== "all") {
    match.availabilityStatus = query.availabilityStatus;
  }

  if (query.category) match.category = slugify(query.category);
  if (query.minRating !== undefined && query.minRating !== "") {
    match.rating = { $gte: Number(query.minRating) };
  }
  if (query.minPrice !== undefined && query.minPrice !== "") {
    match.hourlyRate = match.hourlyRate || {};
    match.hourlyRate.$gte = Number(query.minPrice);
  }
  if (query.maxPrice !== undefined && query.maxPrice !== "") {
    match.hourlyRate = match.hourlyRate || {};
    match.hourlyRate.$lte = Number(query.maxPrice);
  }
  if (query.minExperience !== undefined && query.minExperience !== "") {
    match.experience = { $gte: Number(query.minExperience) };
  }

  return match;
};

const buildProviderSort = (query, hasLocation, hasTextSearch) => {
  if (query.sort === "distance" || query.sort === "nearest") return hasLocation ? { distanceMeters: 1, rating: -1, reviewsCount: -1 } : { rating: -1, reviewsCount: -1, hourlyRate: 1 };
  if (query.sort === "rating") return { rating: -1, reviewsCount: -1, hourlyRate: 1 };
  if (query.sort === "price") return { hourlyRate: 1, rating: -1 };
  if (query.sort === "priceDesc") return { hourlyRate: -1, rating: -1 };
  if (query.sort === "mostBooked") return { completedBookings: -1, rating: -1, reviewsCount: -1 };
  if (query.sort === "newest") return { createdAt: -1 };
  if (hasLocation) return { distanceMeters: 1, rating: -1, reviewsCount: -1 };
  if (hasTextSearch) return { textScore: -1, rating: -1, reviewsCount: -1 };
  return { rating: -1, reviewsCount: -1, hourlyRate: 1 };
};

const searchProviders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const latitude = toNumber(req.query.latitude);
  const longitude = toNumber(req.query.longitude);
  const radiusKm = toNumber(req.query.radius) || 100;
  const q = req.query.q && String(req.query.q).trim();
  const match = buildProviderMatch(req.query);
  const pipeline = [];

  if (req.user && q) {
    await recordSearch({ userId: req.user._id, keyword: q });
  }

  if (latitude !== undefined && longitude !== undefined) {
    const geoNear = {
      near: { type: "Point", coordinates: [longitude, latitude] },
      distanceField: "distanceMeters",
      spherical: true,
      query: match
    };
    if (req.query.radius !== "anywhere") {
      geoNear.maxDistance = radiusKm * 1000;
    }
    pipeline.push({
      $geoNear: geoNear
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
    $lookup: {
      from: "bookings",
      localField: "_id",
      foreignField: "providerId",
      as: "bookings"
    }
  });
  pipeline.push({
    $addFields: {
      completedBookings: {
        $size: {
          $filter: {
            input: "$bookings",
            as: "booking",
            cond: { $eq: ["$$booking.status", "completed"] }
          }
        }
      }
    }
  });
  pipeline.push({
    $sort: buildProviderSort(req.query, latitude !== undefined && longitude !== undefined, Boolean(q))
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
    { $match: { verificationStatus: "approved" } },
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
          $add: [
            { $multiply: ["$rating", 10] },
            "$reviewsCount",
            { $size: "$bookings" }
          ]
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
  const match = { verificationStatus: "approved" };

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
          $add: [
            { $multiply: ["$rating", 10] },
            "$reviewsCount",
            { $multiply: [{ $size: "$bookings" }, 2] }
          ]
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

  return sendSuccess(res, 200, "Search history fetched successfully.", { searches });
});

const clearSearchHistory = asyncHandler(async (req, res) => {
  await SearchHistory.deleteMany({ userId: req.user._id });
  return sendSuccess(res, 200, "Search history cleared successfully.", { searches: [] });
});

module.exports = {
  clearSearchHistory,
  getRecommendedProviders,
  getSearchHistory,
  getTrendingProviders,
  searchProviders
};
