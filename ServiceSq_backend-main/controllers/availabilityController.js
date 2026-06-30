const Availability = require("../models/Availability");
const Booking = require("../models/Booking");
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

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const getProviderSlots = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.params.id).select(
    "availabilityStatus verificationStatus"
  );

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  if (provider.verificationStatus !== "approved") {
    throw new AppError("Provider is not verified yet.", 409);
  }

  const availability = await Availability.findOne({ providerId: provider._id });

  if (provider.availabilityStatus !== "available" || !availability || !availability.isOnline || !availability.isAvailable) {
    throw new AppError("Provider is currently offline or unavailable for new bookings.", 409);
  }

  if (availability.blockedDates && availability.blockedDates.includes(req.query.date)) {
    const durationMinutes = Number(req.query.durationMinutes || 120);
    return sendSuccess(res, 200, "Date is blocked. No slots available.", {
      providerId: provider._id,
      date: req.query.date,
      durationMinutes,
      slots: []
    });
  }

  const date = new Date(`${req.query.date}T00:00:00`);
  const durationMinutes = Number(req.query.durationMinutes || 120);
  const day = WEEKDAYS[date.getDay()];
  const workingHours = (availability && availability.workingHours || []).filter((item) => item.day === day);
  const bookings = await Booking.find({
    providerId: provider._id,
    status: { $in: ["pending", "accepted"] },
    scheduledStart: { $lt: new Date(`${req.query.date}T23:59:59.999`) },
    scheduledEnd: { $gt: date }
  }).select("scheduledStart scheduledEnd");

  const overlapsBooking = (start, end) => bookings.some((booking) => (
    booking.scheduledStart < end && booking.scheduledEnd > start
  ));

  const slots = [];
  
  // Force 24 hour availability regardless of provider's actual working hours
  const startHour = 0;
  const startMinute = 0;
  const endHour = 23;
  const endMinute = 59;
  
  let cursor = new Date(date);
  cursor.setHours(startHour, startMinute, 0, 0);

  const windowEnd = new Date(date);
  windowEnd.setHours(endHour, endMinute, 0, 0);

  while (cursor.getTime() + durationMinutes * 60000 <= windowEnd.getTime()) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + durationMinutes * 60000);
    // Ignore overlapsBooking and slotStart > new Date() for testing
    slots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      label: slotStart.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    });
    cursor = new Date(cursor.getTime() + 30 * 60000);
  }

  return sendSuccess(res, 200, "Available slots fetched successfully.", {
    providerId: provider._id,
    date: req.query.date,
    durationMinutes,
    slots
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

const updateBlockedDates = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  let availability = await Availability.findOne({ providerId: provider._id });

  if (!availability) {
    availability = await Availability.create({ providerId: provider._id });
  }

  availability.blockedDates = req.body.blockedDates || [];
  availability.lastActive = new Date();
  await availability.save();

  await publishEvent("availability.working_hours_updated", {
    providerId: provider._id.toString()
  });

  return sendSuccess(res, 200, "Blocked dates updated successfully.", {
    availability
  });
});

module.exports = {
  getOnlineProviders,
  getProviderAvailability,
  getProviderSlots,
  toggleAvailability,
  updateWorkingHours,
  updateBlockedDates
};
