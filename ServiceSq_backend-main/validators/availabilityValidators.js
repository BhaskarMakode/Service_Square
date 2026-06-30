const { body, param, query } = require("express-validator");

const workingHourValidator = [
  body("workingHours")
    .isArray({ min: 1 })
    .withMessage("workingHours must be a non-empty array."),
  body("workingHours.*.day")
    .isIn(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
    .withMessage("day must be a valid weekday."),
  body("workingHours.*.startTime")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("startTime must be HH:mm."),
  body("workingHours.*.endTime")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("endTime must be HH:mm.")
];

const toggleAvailabilityValidator = [
  body("isOnline")
    .optional()
    .isBoolean()
    .withMessage("isOnline must be boolean."),
  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be boolean.")
];

const providerAvailabilityValidator = [
  param("id")
    .isMongoId()
    .withMessage("provider id must be a valid MongoDB ObjectId.")
];

const providerSlotsValidator = [
  param("id")
    .isMongoId()
    .withMessage("provider id must be a valid MongoDB ObjectId."),
  query("date")
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("date must be an ISO date in YYYY-MM-DD format."),
  query("durationMinutes")
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage("durationMinutes must be between 1 and 480.")
];

const onlineProvidersValidator = [
  query("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("latitude must be between -90 and 90."),
  query("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("longitude must be between -180 and 180."),
  query("radius")
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage("radius must be between 0.1 and 100 kilometers."),
  query("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("category cannot be empty."),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be greater than 0."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100.")
];

const blockedDatesValidator = [
  body("blockedDates")
    .isArray()
    .withMessage("blockedDates must be an array."),
  body("blockedDates.*")
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("Each blocked date must be in YYYY-MM-DD format.")
];

module.exports = {
  onlineProvidersValidator,
  providerAvailabilityValidator,
  providerSlotsValidator,
  toggleAvailabilityValidator,
  workingHourValidator,
  blockedDatesValidator
};
