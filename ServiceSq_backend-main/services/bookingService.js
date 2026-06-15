const Booking = require("../models/Booking");
const AppError = require("../utils/AppError");

const CONFLICT_STATUSES = ["pending", "accepted"];

const ALLOWED_TRANSITIONS = {
  pending: ["accepted", "rejected", "cancelled"],
  accepted: ["completed", "cancelled"],
  rejected: [],
  completed: [],
  cancelled: []
};

const assertValidSchedule = (scheduledStart, scheduledEnd) => {
  const start = new Date(scheduledStart);
  const end = new Date(scheduledEnd);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError("scheduledStart and scheduledEnd must be valid dates.", 400);
  }

  if (start >= end) {
    throw new AppError("scheduledEnd must be after scheduledStart.", 400);
  }

  return {
    start,
    end
  };
};

const ensureNoProviderConflict = async ({ providerId, scheduledStart, scheduledEnd, excludeBookingId }) => {
  const conflictQuery = {
    providerId,
    status: { $in: CONFLICT_STATUSES },
    scheduledStart: { $lt: scheduledEnd },
    scheduledEnd: { $gt: scheduledStart }
  };

  if (excludeBookingId) {
    conflictQuery._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(conflictQuery).select("_id scheduledStart scheduledEnd status");

  if (conflict) {
    throw new AppError("Provider already has a booking during this time window.", 409);
  }
};

const assertValidStatusTransition = (currentStatus, nextStatus) => {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

  if (!allowed.includes(nextStatus)) {
    throw new AppError(`Booking cannot move from ${currentStatus} to ${nextStatus}.`, 400);
  }
};

module.exports = {
  assertValidSchedule,
  ensureNoProviderConflict,
  assertValidStatusTransition
};
