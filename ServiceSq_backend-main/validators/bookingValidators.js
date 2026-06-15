const { body, param, query } = require("express-validator");

const bookingIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("booking id must be a valid MongoDB ObjectId.")
];

const createBookingValidator = [
  body("providerId")
    .isMongoId()
    .withMessage("providerId must be a valid provider profile ObjectId."),
  body("serviceType")
    .trim()
    .notEmpty()
    .withMessage("serviceType is required."),
  body("bookingDate")
    .optional()
    .isISO8601()
    .withMessage("bookingDate must be a valid ISO date."),
  body("scheduledStart")
    .isISO8601()
    .withMessage("scheduledStart must be a valid ISO date."),
  body("scheduledEnd")
    .isISO8601()
    .withMessage("scheduledEnd must be a valid ISO date."),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("address is required."),
  body("amount")
    .isFloat({ min: 0 })
    .withMessage("amount must be a positive number.")
];

const updateBookingStatusValidator = [
  ...bookingIdValidator,
  body("status")
    .isIn(["accepted", "rejected", "completed", "cancelled"])
    .withMessage("status must be accepted, rejected, completed, or cancelled.")
];

const listBookingsValidator = [
  query("status")
    .optional()
    .isIn(["pending", "accepted", "rejected", "completed", "cancelled"])
    .withMessage("status is invalid."),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be greater than 0."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100.")
];

module.exports = {
  bookingIdValidator,
  createBookingValidator,
  updateBookingStatusValidator,
  listBookingsValidator
};
