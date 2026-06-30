const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const Payment = require("../models/Payment");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { createNotification } = require("../services/notificationService");
const { getCommission } = require("../services/paymentService");
const {
  assertValidSchedule,
  assertValidStatusTransition,
  ensureNoProviderConflict
} = require("../services/bookingService");

const bookingPopulation = [
  { path: "customerId", select: "name phone avatar role" },
  {
    path: "providerId",
    populate: {
      path: "userId",
      select: "name avatar role isVerified"
    }
  }
];

const getProviderForCurrentUser = async (userId) => {
  return ProviderProfile.findOne({ userId });
};

const createBooking = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.body.providerId);

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  if (provider.userId.toString() === req.user._id.toString()) {
    throw new AppError("You cannot book your own provider profile.", 400);
  }

  if (provider.verificationStatus !== "approved") {
    throw new AppError("Provider is not verified yet.", 409);
  }

  if (provider.availabilityStatus !== "available") {
    throw new AppError("Provider is not available right now.", 409);
  }

  const availability = await Availability.findOne({ providerId: provider._id });

  if (!availability || !availability.isOnline || !availability.isAvailable) {
    throw new AppError("Provider is not online or available right now.", 409);
  }

  const { start, end } = assertValidSchedule(req.body.scheduledStart, req.body.scheduledEnd);

  await ensureNoProviderConflict({
    providerId: provider._id,
    scheduledStart: start,
    scheduledEnd: end
  });

  const paymentMethod = req.body.paymentMethod || "cash";
  
  let location = undefined;
  if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
    location = {
      type: "Point",
      coordinates: [Number(req.body.longitude), Number(req.body.latitude)]
    };
  }

  const booking = await Booking.create({
    customerId: req.user._id,
    providerId: provider._id,
    serviceType: req.body.serviceType,
    bookingDate: req.body.bookingDate ? new Date(req.body.bookingDate) : start,
    scheduledStart: start,
    scheduledEnd: end,
    address: req.body.address,
    amount: Number(req.body.amount),
    status: "pending",
    paymentMethod,
    paymentStatus: paymentMethod === "cash" ? "unpaid" : "pending",
    location
  });

  if (paymentMethod === "cash") {
    const commission = getCommission(booking.amount);
    const payment = await Payment.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      providerId: booking.providerId,
      amount: booking.amount,
      currency: process.env.PAYMENT_CURRENCY || "INR",
      paymentMethod: "cash",
      paymentStatus: "pending",
      paymentIntentId: `cash_${booking._id}`,
      clientSecretHash: `cash_${booking._id}`,
      commissionAmount: commission.commissionAmount,
      providerEarning: commission.providerEarning
    });

    booking.paymentId = payment._id;
    await booking.save();
  }

  const populatedBooking = await Booking.findById(booking._id).populate(bookingPopulation);

  await createNotification({
    userId: provider.userId,
    title: "New booking request",
    message: `${req.user.name || "A customer"} requested ${booking.serviceType} service.`,
    type: "booking_created",
    relatedResourceType: "Booking",
    relatedResourceId: booking._id
  });

  return sendSuccess(res, 201, "Booking created successfully.", {
    booking: populatedBooking
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 10), 100);
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.user.role === "customer") {
    filter.customerId = req.user._id;
  }

  if (req.user.role === "provider") {
    const provider = await getProviderForCurrentUser(req.user._id);

    if (!provider) {
      return sendSuccess(res, 200, "Bookings fetched successfully.", {
        bookings: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }

    filter.providerId = provider._id;
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .sort({ scheduledStart: -1 })
      .skip(skip)
      .limit(limit)
      .populate(bookingPopulation),
    Booking.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Bookings fetched successfully.", {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getAllBookings = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 10), 100);
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .sort({ scheduledStart: -1 })
      .skip(skip)
      .limit(limit)
      .populate(bookingPopulation),
    Booking.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "All bookings fetched successfully.", {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  const nextStatus = req.body.status;
  assertValidStatusTransition(booking.status, nextStatus);

  if (req.user.role === "customer") {
    if (booking.customerId.toString() !== req.user._id.toString()) {
      throw new AppError("You are not allowed to update this booking.", 403);
    }

    if (nextStatus !== "cancelled") {
      throw new AppError("Customers can only cancel bookings.", 403);
    }
  }

  if (req.user.role === "provider") {
    const provider = await getProviderForCurrentUser(req.user._id);

    if (!provider || booking.providerId.toString() !== provider._id.toString()) {
      throw new AppError("You are not allowed to update this booking.", 403);
    }

    if (provider.verificationStatus !== "approved") {
      throw new AppError("Provider approval is required before managing bookings.", 403);
    }

    if (!["accepted", "rejected", "completed"].includes(nextStatus)) {
      throw new AppError("Providers can only accept, reject, or complete bookings.", 403);
    }

    if (nextStatus === "accepted") {
      await ensureNoProviderConflict({
        providerId: booking.providerId,
        scheduledStart: booking.scheduledStart,
        scheduledEnd: booking.scheduledEnd,
        excludeBookingId: booking._id
      });
    }
  }

  booking.status = nextStatus;
  if (nextStatus === "completed" && booking.paymentMethod === "cash") {
    const payment = await Payment.findOne({ bookingId: booking._id });
    if (payment && payment.paymentStatus !== "succeeded") {
      payment.paymentStatus = "succeeded";
      payment.transactionId = payment.transactionId || `cash_paid_${booking._id}`;
      payment.verifiedAt = new Date();
      await payment.save();
      booking.paymentId = payment._id;
    }
    booking.paymentStatus = "paid";
    booking.cashCollectedAt = new Date();
  }
  await booking.save();

  const notificationMap = {
    accepted: ["Booking accepted", "Your booking request was accepted.", "booking_accepted"],
    rejected: ["Booking rejected", "Your booking request was rejected.", "booking_rejected"],
    completed: ["Booking completed", "Your booking was marked as completed.", "booking_completed"],
    cancelled: ["Booking cancelled", "Your booking was cancelled.", "booking_rejected"]
  };

  const notificationDetails = notificationMap[nextStatus];
  if (notificationDetails) {
    await createNotification({
      userId: booking.customerId,
      title: notificationDetails[0],
      message: notificationDetails[1],
      type: notificationDetails[2],
      relatedResourceType: "Booking",
      relatedResourceId: booking._id
    });
  }

  await auditLog({
    req,
    action: "booking.status_updated",
    entityType: "Booking",
    entityId: booking._id,
    metadata: {
      status: nextStatus
    }
  });

  await booking.populate(bookingPopulation);

  return sendSuccess(res, 200, "Booking status updated successfully.", {
    booking
  });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (req.user.role === "customer" && booking.customerId.toString() !== req.user._id.toString()) {
    throw new AppError("You are not allowed to view this booking.", 403);
  }

  if (req.user.role === "provider") {
    const provider = await getProviderForCurrentUser(req.user._id);

    if (!provider || booking.providerId.toString() !== provider._id.toString()) {
      throw new AppError("You are not allowed to view this booking.", 403);
    }
  }

  await booking.populate(bookingPopulation);

  return sendSuccess(res, 200, "Booking fetched successfully.", {
    booking
  });
});

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  getBookingById
};
