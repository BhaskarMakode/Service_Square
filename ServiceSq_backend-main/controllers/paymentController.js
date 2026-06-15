const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");
const { createNotification } = require("../services/notificationService");
const {
  createPaymentIntent: createGatewayPaymentIntent,
  getCommission,
  verifyPaymentIntent
} = require("../services/paymentService");

const paymentPopulation = [
  { path: "bookingId", select: "serviceType status paymentStatus scheduledStart scheduledEnd" },
  { path: "customerId", select: "name phone avatar role" },
  {
    path: "providerId",
    populate: {
      path: "userId",
      select: "name avatar role"
    }
  }
];

const createPaymentIntent = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.body.bookingId);

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.customerId.toString() !== req.user._id.toString()) {
    throw new AppError("You can only pay for your own booking.", 403);
  }

  if (["rejected", "cancelled"].includes(booking.status)) {
    throw new AppError("This booking cannot be paid.", 400);
  }

  const existingPaidPayment = await Payment.findOne({
    bookingId: booking._id,
    paymentStatus: "succeeded"
  });

  if (existingPaidPayment) {
    throw new AppError("Booking is already paid.", 409);
  }

  const gatewayIntent = await createGatewayPaymentIntent({
    amount: booking.amount,
    currency: process.env.PAYMENT_CURRENCY || "INR"
  });
  const commission = getCommission(booking.amount);

  const payment = await Payment.findOneAndUpdate(
    { bookingId: booking._id },
    {
      customerId: booking.customerId,
      providerId: booking.providerId,
      amount: booking.amount,
      currency: gatewayIntent.currency,
      paymentMethod: req.body.paymentMethod || "mock",
      paymentStatus: "pending",
      paymentIntentId: gatewayIntent.paymentIntentId,
      clientSecretHash: gatewayIntent.clientSecretHash,
      commissionAmount: commission.commissionAmount,
      providerEarning: commission.providerEarning
    },
    { new: true, upsert: true, runValidators: true }
  );

  booking.paymentStatus = "pending";
  booking.paymentId = payment._id;
  await booking.save();

  await auditLog({
    req,
    action: "payment.intent_created",
    entityType: "Payment",
    entityId: payment._id,
    metadata: {
      bookingId: booking._id,
      amount: booking.amount
    }
  });

  return sendSuccess(res, 201, "Payment intent created successfully.", {
    payment,
    paymentId: payment._id,
    clientSecret: gatewayIntent.clientSecret
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.body.paymentId);

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  if (payment.customerId.toString() !== req.user._id.toString()) {
    throw new AppError("You can only verify your own payment.", 403);
  }

  if (payment.paymentStatus === "succeeded") {
    throw new AppError("Payment is already verified.", 409);
  }

  await verifyPaymentIntent({
    payment,
    clientSecret: req.body.clientSecret,
    transactionId: req.body.transactionId,
    signature: req.body.signature
  });

  payment.paymentStatus = "succeeded";
  payment.transactionId = req.body.transactionId;
  payment.verifiedAt = new Date();
  await payment.save();

  const booking = await Booking.findByIdAndUpdate(
    payment.bookingId,
    {
      paymentStatus: "paid",
      paymentId: payment._id
    },
    { new: true }
  );

  const provider = await ProviderProfile.findById(payment.providerId);

  if (provider) {
    await createNotification({
      userId: provider.userId,
      title: "Payment received",
      message: `Payment received for ${booking ? booking.serviceType : "a booking"}.`,
      type: "payment_received",
      relatedResourceType: "Payment",
      relatedResourceId: payment._id
    });
  }

  await auditLog({
    req,
    action: "payment.verified",
    entityType: "Payment",
    entityId: payment._id,
    metadata: {
      transactionId: payment.transactionId
    }
  });

  await payment.populate(paymentPopulation);

  return sendSuccess(res, 200, "Payment verified successfully.", {
    payment
  });
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.user.role === "customer") {
    filter.customerId = req.user._id;
  } else if (req.user.role === "provider") {
    const provider = await ProviderProfile.findOne({ userId: req.user._id });
    filter.providerId = provider ? provider._id : null;
  }

  if (req.query.paymentStatus) {
    filter.paymentStatus = req.query.paymentStatus;
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate(paymentPopulation),
    Payment.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Payment history fetched successfully.", {
    payments,
    pagination: buildPagination({ page, limit, total })
  });
});

const getProviderEarnings = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findOne({ userId: req.user._id });

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const [summary] = await Payment.aggregate([
    {
      $match: {
        providerId: provider._id,
        paymentStatus: "succeeded"
      }
    },
    {
      $group: {
        _id: "$providerId",
        totalRevenue: { $sum: "$amount" },
        totalCommission: { $sum: "$commissionAmount" },
        totalEarnings: { $sum: "$providerEarning" },
        transactions: { $sum: 1 }
      }
    }
  ]);

  return sendSuccess(res, 200, "Provider earnings fetched successfully.", {
    providerId: provider._id,
    summary: summary || {
      totalRevenue: 0,
      totalCommission: 0,
      totalEarnings: 0,
      transactions: 0
    }
  });
});

module.exports = {
  createPaymentIntent,
  getPaymentHistory,
  getProviderEarnings,
  verifyPayment
};
