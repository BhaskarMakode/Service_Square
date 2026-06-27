const Availability = require("../models/Availability");
const Category = require("../models/Category");
const ProviderProfile = require("../models/ProviderProfile");
const Upload = require("../models/Upload");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPoint, getCoordinatesFromBody, toNumber } = require("../utils/location");
const slugify = require("../utils/slugify");

const normalizeSkills = (skills = []) => {
  return skills.map((skill) => String(skill).trim().toLowerCase()).filter(Boolean);
};

const resolveActiveCategory = async (categoryValue) => {
  if (categoryValue === undefined) return null;

  const slug = slugify(categoryValue);
  const category = await Category.findOne({
    slug,
    isActive: true,
    deletedAt: null
  });

  if (!category) {
    throw new AppError("Active service category not found.", 400);
  }

  return category;
};

const buildProfilePayload = async (body, requireLocation = false) => {
  const payload = {};

  if (body.category !== undefined) {
    const category = await resolveActiveCategory(body.category);
    payload.category = category.slug;
    payload.categoryId = category._id;
    payload._resolvedCategory = category;
  }

  if (body.skills !== undefined) payload.skills = normalizeSkills(body.skills);
  if (body.hourlyRate !== undefined) payload.hourlyRate = Number(body.hourlyRate);
  if (body.experience !== undefined) payload.experience = Number(body.experience);
  if (body.availabilityStatus !== undefined) payload.availabilityStatus = body.availabilityStatus;
  if (body.address !== undefined) payload.address = String(body.address).trim();
  if (body.bio !== undefined) payload.bio = String(body.bio).trim();
  if (body.services !== undefined) {
    if (Array.isArray(body.services)) {
      payload.services = body.services.map((s) => ({
        _id: s._id,
        title: String(s.title || "").trim(),
        description: s.description ? String(s.description).trim() : "",
        price: Number(s.price || 0),
        duration: Number(s.duration || 0),
        isActive: s.isActive !== undefined ? Boolean(s.isActive) : true
      }));
    } else {
      payload.services = [];
    }
  }

  const { longitude, latitude } = getCoordinatesFromBody(body);

  if (longitude !== undefined || latitude !== undefined || requireLocation) {
    payload.location = buildPoint(longitude, latitude);
  }

  return payload;
};

const populateProvider = async (provider) => {
  await provider.populate([
    { path: "userId", select: "name avatar role isVerified" },
    { path: "categoryId", select: "name slug icon description" }
  ]);

  const availability = await Availability.findOne({ providerId: provider._id });
  const uploads = await Upload.find({ providerId: provider._id });

  return {
    ...provider.toObject(),
    availability,
    uploads
  };
};

const createProfile = asyncHandler(async (req, res) => {
  const existingProfile = await ProviderProfile.findOne({ userId: req.user._id });

  if (existingProfile) {
    throw new AppError("Provider profile already exists.", 409);
  }

  const payload = await buildProfilePayload(req.body, true);
  const resolvedCategory = payload._resolvedCategory;
  delete payload._resolvedCategory;

  const provider = await ProviderProfile.create({
    ...payload,
    userId: req.user._id
  });

  await Availability.create({
    providerId: provider._id,
    isOnline: false,
    isAvailable: false,
    lastActive: new Date()
  });

  if (resolvedCategory) {
    await Category.findByIdAndUpdate(resolvedCategory._id, { $inc: { usageCount: 1 } });
  }

  return sendSuccess(res, 201, "Provider profile created successfully.", {
    provider: await populateProvider(provider)
  });
});

const getNearbyProviders = asyncHandler(async (req, res) => {
  const latitude = toNumber(req.query.latitude);
  const longitude = toNumber(req.query.longitude);
  const radiusKm = toNumber(req.query.radius) || 10;
  const maxDistance = radiusKm * 1000;
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 10), 100);
  const skip = (page - 1) * limit;

  const query = {
    verificationStatus: "approved",
    availabilityStatus: req.query.availabilityStatus || "available"
  };

  if (req.query.category) {
    query.category = slugify(req.query.category);
  }

  if (req.query.minRating !== undefined) {
    query.rating = {
      ...(query.rating || {}),
      $gte: Number(req.query.minRating)
    };
  }

  if (req.query.maxPrice !== undefined) {
    query.hourlyRate = {
      $lte: Number(req.query.maxPrice)
    };
  }

  const sort = req.query.sort || "distance";
  const sortStage = {
    distance: { distanceMeters: 1, rating: -1 },
    rating: { rating: -1, distanceMeters: 1 },
    price: { hourlyRate: 1, distanceMeters: 1 }
  }[sort];

  const [result = { metadata: [], providers: [] }] = await ProviderProfile.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        distanceField: "distanceMeters",
        maxDistance,
        spherical: true,
        query
      }
    },
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
    },
    {
      $addFields: {
        distanceKm: {
          $round: [{ $divide: ["$distanceMeters", 1000] }, 2]
        }
      }
    },
    { $sort: sortStage },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        providers: [
          { $skip: skip },
          { $limit: limit },
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
              "user.__v": 0,
              "user.phone": 0,
              "user.email": 0,
              "user.createdAt": 0,
              "user.updatedAt": 0,
              "availability.__v": 0,
              "categoryDetails.__v": 0
            }
          }
        ]
      }
    }
  ]);

  const total = result.metadata[0] ? result.metadata[0].total : 0;

  return sendSuccess(res, 200, "Nearby providers fetched successfully.", {
    providers: result.providers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    filters: {
      radiusKm,
      sort
    }
  });
});

const getProviderById = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.params.id);

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const isAdmin = req.user && req.user.role === "admin";
  const isOwner = req.user && provider.userId.toString() === req.user._id.toString();

  if (provider.verificationStatus !== "approved" && !isAdmin && !isOwner) {
    throw new AppError("Provider profile not found.", 404);
  }

  return sendSuccess(res, 200, "Provider profile fetched successfully.", {
    provider: await populateProvider(provider)
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findOne({ userId: req.user._id });

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const oldCategoryId = provider.categoryId && provider.categoryId.toString();
  const payload = await buildProfilePayload(req.body, false);
  const resolvedCategory = payload._resolvedCategory;
  delete payload._resolvedCategory;

  Object.assign(provider, payload);
  await provider.save();

  if (resolvedCategory && oldCategoryId !== resolvedCategory._id.toString()) {
    if (oldCategoryId) {
      await Category.findByIdAndUpdate(oldCategoryId, { $inc: { usageCount: -1 } });
    }
    await Category.findByIdAndUpdate(resolvedCategory._id, { $inc: { usageCount: 1 } });
  }

  return sendSuccess(res, 200, "Provider profile updated successfully.", {
    provider: await populateProvider(provider)
  });
});

module.exports = {
  createProfile,
  getNearbyProviders,
  getProviderById,
  updateProfile
};
