const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");
const slugify = require("../utils/slugify");

const getDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalProviders, activeBookings, revenueResult] = await Promise.all([
    User.countDocuments({ deletedAt: null }),
    ProviderProfile.countDocuments(),
    Booking.countDocuments({ status: { $in: ["pending", "accepted"] } }),
    Payment.aggregate([
      { $match: { paymentStatus: "succeeded" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" }, transactions: { $sum: 1 } } }
    ])
  ]);

  return sendSuccess(res, 200, "Dashboard statistics fetched successfully.", {
    stats: {
      totalUsers,
      totalProviders,
      activeBookings,
      totalRevenue: revenueResult[0] ? revenueResult[0].totalRevenue : 0,
      transactions: revenueResult[0] ? revenueResult[0].transactions : 0
    }
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { deletedAt: null };

  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: regex }, { phone: regex }, { email: regex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Users fetched successfully.", {
    users,
    pagination: buildPagination({ page, limit, total })
  });
});

const getProviders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.verificationStatus) filter.verificationStatus = req.query.verificationStatus;
  if (req.query.category) filter.category = slugify(req.query.category);
  if (req.query.availabilityStatus) filter.availabilityStatus = req.query.availabilityStatus;

  const [providers, total] = await Promise.all([
    ProviderProfile.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name phone email avatar role isVerified isActive")
      .populate("categoryId", "name slug icon"),
    ProviderProfile.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Providers fetched successfully.", {
    providers,
    pagination: buildPagination({ page, limit, total })
  });
});

const verifyProvider = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.params.id);

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  provider.verificationStatus = req.body.status;
  provider.verifiedAt = req.body.status === "approved" ? new Date() : null;
  provider.verifiedBy = req.user._id;
  provider.rejectionReason = req.body.status === "rejected" ? req.body.rejectionReason : undefined;
  await provider.save();

  await auditLog({
    req,
    action: "admin.provider_verification_updated",
    entityType: "ProviderProfile",
    entityId: provider._id,
    metadata: {
      status: req.body.status
    }
  });

  return sendSuccess(res, 200, "Provider verification updated successfully.", {
    provider
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new AppError("Admin users cannot delete their own account.", 400);
  }

  const user = await User.findOne({ _id: req.params.id, deletedAt: null });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  user.isActive = false;
  user.deletedAt = new Date();
  await user.save();

  await auditLog({
    req,
    action: "admin.user_deleted",
    entityType: "User",
    entityId: user._id
  });

  return sendSuccess(res, 200, "User deleted successfully.", {
    user: user.toSafeObject()
  });
});

module.exports = {
  deleteUser,
  getDashboard,
  getProviders,
  getUsers,
  verifyProvider
};
