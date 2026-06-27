const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const ProviderProfile = require("../models/ProviderProfile");
const Review = require("../models/Review");
const SupportTicket = require("../models/SupportTicket");
const Verification = require("../models/Verification");
const Upload = require("../models/Upload");
const Portfolio = require("../models/Portfolio");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");
const slugify = require("../utils/slugify");

const getDashboard = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
  const chartStart = new Date(startOfDay);
  chartStart.setDate(chartStart.getDate() - 6);

  const [totalUsers, totalProviders, activeProviders, pendingVerifications, activeBookings,
    completedBookings, cancelledBookings, supportTickets, reviews, revenueResult,
    dailyRevenue, recentUsers, recentBookings, recentPayments, recentReviews,
    recentVerifications, recentTickets] = await Promise.all([
    User.countDocuments({ role: "customer", deletedAt: null }),
    ProviderProfile.countDocuments(),
    ProviderProfile.countDocuments({ verificationStatus: "approved", availabilityStatus: "available" }),
    ProviderProfile.countDocuments({ verificationStatus: "pending" }),
    Booking.countDocuments({ status: { $in: ["pending", "accepted"] } }),
    Booking.countDocuments({ status: "completed" }),
    Booking.countDocuments({ status: "cancelled" }),
    SupportTicket.countDocuments({ status: { $in: ["open", "in_progress"] } }),
    Review.countDocuments(),
    Payment.aggregate([
      { $match: { paymentStatus: "succeeded" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" }, platformRevenue: { $sum: "$commissionAmount" }, providerEarnings: { $sum: "$providerEarning" }, monthlyRevenue: { $sum: { $cond: [{ $gte: ["$verifiedAt", startOfMonth] }, "$commissionAmount", 0] } }, dailyRevenue: { $sum: { $cond: [{ $gte: ["$verifiedAt", startOfDay] }, "$commissionAmount", 0] } }, transactions: { $sum: 1 } } }
    ]),
    Payment.aggregate([
      { $match: { paymentStatus: "succeeded", verifiedAt: { $gte: chartStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$verifiedAt" } }, amount: { $sum: "$commissionAmount" }, transactions: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", amount: 1, transactions: 1 } }
    ]),
    User.find({ role: { $in: ["customer", "provider"] }, deletedAt: null }).sort({ createdAt: -1 }).limit(10).select("name role createdAt"),
    Booking.find({}).sort({ updatedAt: -1 }).limit(15).select("serviceType status createdAt updatedAt"),
    Payment.find({ paymentStatus: "succeeded" }).sort({ verifiedAt: -1 }).limit(10).select("amount commissionAmount verifiedAt"),
    Review.find({}).sort({ createdAt: -1 }).limit(10).populate("customerId", "name").select("rating customerId createdAt"),
    Verification.find({}).sort({ updatedAt: -1 }).limit(10).populate({ path: "providerId", populate: { path: "userId", select: "name" } }),
    SupportTicket.find({}).sort({ createdAt: -1 }).limit(10).populate("userId", "name role").select("subject userId createdAt")
  ]);

  const activities = [
    ...recentUsers.map((item) => ({ type: `${item.role}_registration`, text: `${item.name || "A user"} registered as ${item.role}`, timestamp: item.createdAt })),
    ...recentBookings.map((item) => ({ type: `booking_${item.status}`, text: `${item.serviceType} booking ${item.status}`, timestamp: item.status === "pending" ? item.createdAt : item.updatedAt })),
    ...recentPayments.map((item) => ({ type: "payment_received", text: `Platform payment received (${item.commissionAmount || 0} commission)`, timestamp: item.verifiedAt })),
    ...recentReviews.map((item) => ({ type: "review_submitted", text: `${item.customerId?.name || "A customer"} submitted a ${item.rating}-star review`, timestamp: item.createdAt })),
    ...recentVerifications.map((item) => ({ type: "provider_verification", text: `${item.providerId?.userId?.name || "A provider"} verification is ${item.verificationStatus}`, timestamp: item.updatedAt })),
    ...recentTickets.map((item) => ({ type: "support_ticket_created", text: `${item.userId?.name || "A user"} created support ticket: ${item.subject}`, timestamp: item.createdAt }))
  ].filter((item) => item.timestamp).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 25);

  const revenue = revenueResult[0] || {};

  return sendSuccess(res, 200, "Dashboard statistics fetched successfully.", {
    stats: {
      totalUsers,
      totalProviders,
      activeProviders,
      pendingVerifications,
      activeBookings,
      completedBookings,
      cancelledBookings,
      supportTickets,
      reviews,
      totalRevenue: revenue.totalRevenue || 0,
      platformRevenue: revenue.platformRevenue || 0,
      providerEarnings: revenue.providerEarnings || 0,
      monthlyRevenue: revenue.monthlyRevenue || 0,
      dailyRevenue: revenue.dailyRevenue || 0,
      transactions: revenue.transactions || 0
    },
    dailyRevenue,
    activities
  });
});

const getProviderDetail = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.params.id)
    .populate("userId", "name phone email avatar role isVerified isActive createdAt")
    .populate("categoryId", "name slug icon");
  if (!provider) throw new AppError("Provider profile not found.", 404);

  const [verifications, uploads, portfolio, bookings, payments, reviews] = await Promise.all([
    Verification.find({ providerId: provider._id }).sort({ submittedAt: -1 }).populate("reviewedBy", "name email"),
    Upload.find({ providerId: provider._id, type: { $in: ["document", "verification_document"] } }).sort({ createdAt: -1 }),
    Portfolio.find({ providerId: provider._id }).sort({ createdAt: -1 }),
    Booking.find({ providerId: provider._id }).sort({ createdAt: -1 }).limit(50).populate("customerId", "name phone avatar"),
    Payment.find({ providerId: provider._id, paymentStatus: "succeeded" }).sort({ verifiedAt: -1 }).limit(50),
    Review.find({ providerId: provider._id }).sort({ createdAt: -1 }).limit(50).populate("customerId", "name avatar")
  ]);
  return sendSuccess(res, 200, "Provider details fetched successfully.", { provider, verifications, uploads, portfolio, bookings, payments, reviews });
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

const getPendingProviders = asyncHandler(async (req, res) => {
  req.query.verificationStatus = "pending";
  return getProviders(req, res);
});

const getVerifiedProviders = asyncHandler(async (req, res) => {
  req.query.verificationStatus = "approved";
  return getProviders(req, res);
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

  const latestVerification = await Verification.findOne({ providerId: provider._id }).sort({ submittedAt: -1 });
  if (latestVerification) {
    latestVerification.verificationStatus = req.body.status;
    latestVerification.reviewedAt = new Date();
    latestVerification.reviewedBy = req.user._id;
    latestVerification.rejectionReason = req.body.status === "rejected" ? req.body.rejectionReason : undefined;
    await latestVerification.save();
  }

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

const approveProvider = asyncHandler(async (req, res) => {
  req.body.status = "approved";
  return verifyProvider(req, res);
});

const rejectProvider = asyncHandler(async (req, res) => {
  req.body.status = "rejected";
  return verifyProvider(req, res);
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
  getProviderDetail,
  getPendingProviders,
  getProviders,
  getVerifiedProviders,
  getUsers,
  approveProvider,
  rejectProvider,
  verifyProvider
};
