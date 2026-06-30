const LiveLocation = require("../models/LiveLocation");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPoint, getCoordinatesFromBody, toNumber } = require("../utils/location");
const { publishEvent } = require("../services/realtimeService");

const getCurrentProvider = async (userId) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  return provider;
};

const toRadians = (value) => (value * Math.PI) / 180;

const getDistanceKm = ([fromLongitude, fromLatitude], [toLongitude, toLatitude]) => {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(toLatitude - fromLatitude);
  const deltaLon = toRadians(toLongitude - fromLongitude);
  const lat1 = toRadians(fromLatitude);
  const lat2 = toRadians(toLatitude);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((earthRadiusKm * c).toFixed(2));
};

const updateLocation = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  const { longitude, latitude } = getCoordinatesFromBody(req.body);
  const location = buildPoint(longitude, latitude);

  const liveLocation = await LiveLocation.findOneAndUpdate(
    { providerId: provider._id },
    {
      providerId: provider._id,
      location,
      updatedAt: new Date()
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  provider.location = location;
  await provider.save();

  await publishEvent("location.updated", {
    providerId: provider._id.toString(),
    location
  });

  await auditLog({
    req,
    action: "location.updated",
    entityType: "LiveLocation",
    entityId: liveLocation._id,
    metadata: {
      providerId: provider._id
    }
  });

  return sendSuccess(res, 200, "Live location updated successfully.", {
    liveLocation
  });
});

const getProviderLocation = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.params.id).select("userId category availabilityStatus location address");

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  let liveLocation = await LiveLocation.findOne({ providerId: provider._id });

  if (!liveLocation) {
    if (provider.location && provider.location.coordinates) {
      liveLocation = {
        providerId: provider._id,
        location: provider.location,
        updatedAt: provider.updatedAt || new Date()
      };
    } else {
      throw new AppError("Live location not found for this provider.", 404);
    }
  }

  const latitude = toNumber(req.query.latitude);
  const longitude = toNumber(req.query.longitude);
  const data = {
    provider,
    liveLocation
  };

  if (latitude !== undefined && longitude !== undefined) {
    data.distanceKm = getDistanceKm([longitude, latitude], liveLocation.location.coordinates);
  }

  return sendSuccess(res, 200, "Provider live location fetched successfully.", data);
});

module.exports = {
  getProviderLocation,
  updateLocation
};
