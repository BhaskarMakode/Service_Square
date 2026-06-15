const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const getYearRange = (query) => {
  const year = Number(query.year || new Date().getUTCFullYear());
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  return {
    year,
    start,
    end
  };
};

const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { year, start, end } = getYearRange(req.query);

  const [monthlyRevenue, summaryResult] = await Promise.all([
    Payment.aggregate([
      {
        $match: {
          paymentStatus: "succeeded",
          verifiedAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$verifiedAt" } },
          revenue: { $sum: "$amount" },
          platformEarnings: { $sum: "$commissionAmount" },
          providerEarnings: { $sum: "$providerEarning" },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          revenue: 1,
          platformEarnings: 1,
          providerEarnings: 1,
          transactions: 1
        }
      }
    ]),
    Payment.aggregate([
      { $match: { paymentStatus: "succeeded" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalPlatformEarnings: { $sum: "$commissionAmount" },
          totalProviderEarnings: { $sum: "$providerEarning" },
          transactions: { $sum: 1 }
        }
      }
    ])
  ]);

  return sendSuccess(res, 200, "Revenue analytics fetched successfully.", {
    year,
    monthlyRevenue,
    summary: summaryResult[0] || {
      totalRevenue: 0,
      totalPlatformEarnings: 0,
      totalProviderEarnings: 0,
      transactions: 0
    }
  });
});

const getBookingAnalytics = asyncHandler(async (req, res) => {
  const { year, start, end } = getYearRange(req.query);

  const [monthlyBookings, statusSummary] = await Promise.all([
    Booking.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            status: "$status"
          },
          count: { $sum: 1 },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          status: "$_id.status",
          count: 1,
          amount: 1
        }
      }
    ]),
    Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          amount: 1
        }
      }
    ])
  ]);

  return sendSuccess(res, 200, "Booking analytics fetched successfully.", {
    year,
    monthlyBookings,
    statusSummary
  });
});

const getProviderAnalytics = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 10), 50);

  const [topProviders, summary] = await Promise.all([
    ProviderProfile.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "providerId",
          as: "payments"
        }
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "providerId",
          as: "bookings"
        }
      },
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
        $addFields: {
          succeededPayments: {
            $filter: {
              input: "$payments",
              as: "payment",
              cond: { $eq: ["$$payment.paymentStatus", "succeeded"] }
            }
          },
          completedBookings: {
            $filter: {
              input: "$bookings",
              as: "booking",
              cond: { $eq: ["$$booking.status", "completed"] }
            }
          }
        }
      },
      {
        $project: {
          providerId: "$_id",
          name: "$user.name",
          category: 1,
          rating: 1,
          reviewsCount: 1,
          isPremium: 1,
          totalRevenue: { $sum: "$succeededPayments.amount" },
          totalEarnings: { $sum: "$succeededPayments.providerEarning" },
          completedBookings: { $size: "$completedBookings" }
        }
      },
      { $sort: { totalRevenue: -1, completedBookings: -1, rating: -1 } },
      { $limit: limit }
    ]),
    ProviderProfile.aggregate([
      {
        $group: {
          _id: null,
          totalProviders: { $sum: 1 },
          approvedProviders: {
            $sum: { $cond: [{ $eq: ["$verificationStatus", "approved"] }, 1, 0] }
          },
          premiumProviders: {
            $sum: { $cond: ["$isPremium", 1, 0] }
          }
        }
      }
    ])
  ]);

  return sendSuccess(res, 200, "Provider analytics fetched successfully.", {
    summary: summary[0] || {
      totalProviders: 0,
      approvedProviders: 0,
      premiumProviders: 0
    },
    topProviders
  });
});

const getUserAnalytics = asyncHandler(async (req, res) => {
  const { year, start, end } = getYearRange(req.query);

  const [roleSummary, activeUsers, monthlyUsers] = await Promise.all([
    User.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          role: "$_id",
          count: 1
        }
      }
    ]),
    User.countDocuments({ isActive: true, isVerified: true, deletedAt: null }),
    User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          deletedAt: null
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            role: "$role"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          role: "$_id.role",
          count: 1
        }
      }
    ])
  ]);

  return sendSuccess(res, 200, "User analytics fetched successfully.", {
    year,
    activeUsers,
    roleSummary,
    monthlyUsers
  });
});

module.exports = {
  getBookingAnalytics,
  getProviderAnalytics,
  getRevenueAnalytics,
  getUserAnalytics
};
