const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const requireApprovedProvider = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "provider") {
    throw new AppError("Provider access is required.", 403);
  }

  const provider = await ProviderProfile.findOne({ userId: req.user._id });

  if (!provider) {
    throw new AppError("Provider profile is required before accessing this feature.", 404);
  }

  if (provider.verificationStatus !== "approved") {
    throw new AppError("Provider approval is required before accessing this feature.", 403);
  }

  req.providerProfile = provider;
  next();
});

module.exports = requireApprovedProvider;
