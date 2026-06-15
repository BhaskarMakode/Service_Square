const Availability = require("../models/Availability");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");
const slugify = require("../utils/slugify");
const { publishEvent } = require("../services/realtimeService");

const getCurrentProvider = async (userId) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  return provider;
};

const syncProviderStatus = async (provider, availability) => {
  provider.availabilityStatus = availability.isOnline
    ? availability.isAvailable
      ? "available"
      : "busy"
    : "offline";

  await provider.save();
};

const toggleAvailability = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  let availability = await Availability.findOne({ providerId: provider._id });

  if (!availability) {
    availability = await Availability.create({ providerId: provider._id });
  }

  const hasOnline = req.body.isOnline !== undefined;
  const hasAvailable = req.body.isAvailable !== undefined;

  availability.isOnline = hasOnline ? Boolean(req.body.isOnline) : true;
  availability.isAvailable = hasAvailable ? Boolean(req.body.isAvailable) : !availability.isAvailable;

  if (!availability.isOnline) {
    availability.isAvailable = false;
  }

  availability.lastActive = new Date();
  await availability.save();
  await syncProviderStatus(provider, availability);

  await publishEvent("availability.updated", {
    providerId: provider._id.toString(),
    isOnline: availability.isOnline,
    isAvailable: availability.isAvailable
  });

  await auditLog({
    req,
    action: "availability.toggled",
    entityType: "Availability",
    entityId: availability._id,
    metadata: {
      providerId: provider._id,
      isOnline: availability.isOnline,
      isAvailable: availability.isAvailable
    }
  });

  return sendSuccess(res, 200, "Availability updated successfully.", {
    availability,
    providerStatus: provider.availabilityStatus
  });
});

const getProviderAvailability = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.params.id).select(
    "userId category availabilityStatus verificationStatus"
  );

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const availability = await Availability.findOne({ providerId: provider._id });

  return sendSuccess(res, 200, "Provider availability fetched successfully.", {
    provider,
    availability
  });
});

const updateWorkingHours = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  let availability = await Availability.findOne({ providerId: provider._id });

  if (!availability) {
    availability = await Availability.create({ providerId: provider._id });
  }

  for (const item of req.body.workingHours) {
    if (item.startTime >= item.endTime) {
      throw new AppError("Each working hour endTime must be after startTime.", 400);
    }
  }

  availability.workingHours = req.body.workingHours;
  availability.lastActive = new Date();
  await availability.save();

  await publishEvent("availability.working_hours_updated", {
    providerId: provider._id.toString()
  });

  await auditLog({
    req,
    action: "availability.working_hours_updated",
    entityType: "Availability",
    entityId: availability._id,
    metadata: {
      providerId: provider._id
    }
  });

  return sendSuccess(res, 200, "Working hours updated successfully.", {
    availability
  });
});

const getOnlineProviders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const providerMatch = {
    verificationStatus: "approved",
    availabilityStatus: "available"
  };

  if (req.query.category) {
    providerMatch.category = slugify(req.query.category);
  }

  const pipeline = [
    { $match: { isOnline: true, isAvailable: true } },
    {
      $lookup: {
        from: "providerprofiles",
        localField: "providerId",
        foreignField: "_id",
        as: "provider"
      }
    },
    { $unwind: "$provider" },
    { $match: Object.fromEntries(Object.entries(providerMatch).map(([key, value]) => [`provider.${key}`, value])) },
    {
      $lookup: {
        from: "users",
        localField: "provider.userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    { $sort: { lastActive: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        providers: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              isOnline: 1,
              isAvailable: 1,
              lastActive: 1,
              workingHours: 1,
              provider: 1,
              "user.name": 1,
              "user.avatar": 1,
              "user.role": 1
            }
          }
        ]
      }
    }
  ];

  const [result = { metadata: [], providers: [] }] = await Availability.aggregate(pipeline);
  const total = result.metadata[0] ? result.metadata[0].total : 0;

  return sendSuccess(res, 200, "Online providers fetched successfully.", {
    providers: result.providers,
    pagination: buildPagination({ page, limit, total })
  });
});

module.exports = {
  getOnlineProviders,
  getProviderAvailability,
  toggleAvailability,
  updateWorkingHours
};
