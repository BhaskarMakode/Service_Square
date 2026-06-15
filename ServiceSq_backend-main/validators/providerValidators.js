const { body, param, query } = require("express-validator");

const availabilityValues = ["available", "busy", "offline"];

const createProviderValidator = [
  body("category")
    .trim()
    .notEmpty()
    .withMessage("category is required."),
  body("skills")
    .isArray({ min: 1 })
    .withMessage("skills must be a non-empty array."),
  body("skills.*")
    .trim()
    .notEmpty()
    .withMessage("each skill must be a non-empty string."),
  body("hourlyRate")
    .isFloat({ min: 0 })
    .withMessage("hourlyRate must be a positive number."),
  body("experience")
    .isInt({ min: 0 })
    .withMessage("experience must be a positive integer."),
  body("availabilityStatus")
    .optional()
    .isIn(availabilityValues)
    .withMessage("availabilityStatus must be available, busy, or offline."),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("address is required."),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("latitude must be between -90 and 90."),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("longitude must be between -180 and 180."),
  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("location.coordinates must be [longitude, latitude].")
];

const nearbyProviderValidator = [
  query("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("latitude query parameter is required and must be between -90 and 90."),
  query("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("longitude query parameter is required and must be between -180 and 180."),
  query("radius")
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage("radius must be between 0.1 and 100 kilometers."),
  query("minRating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("minRating must be between 0 and 5."),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("maxPrice must be a positive number."),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be greater than 0."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100."),
  query("sort")
    .optional()
    .isIn(["distance", "rating", "price"])
    .withMessage("sort must be distance, rating, or price."),
  query("availabilityStatus")
    .optional()
    .isIn(availabilityValues)
    .withMessage("availabilityStatus must be available, busy, or offline.")
];

const providerIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("provider id must be a valid MongoDB ObjectId.")
];

const updateProviderValidator = [
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("category cannot be empty."),
  body("skills")
    .optional()
    .isArray({ min: 1 })
    .withMessage("skills must be a non-empty array."),
  body("skills.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("each skill must be a non-empty string."),
  body("hourlyRate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("hourlyRate must be a positive number."),
  body("experience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("experience must be a positive integer."),
  body("availabilityStatus")
    .optional()
    .isIn(availabilityValues)
    .withMessage("availabilityStatus must be available, busy, or offline."),
  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("address cannot be empty."),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("latitude must be between -90 and 90."),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("longitude must be between -180 and 180."),
  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("location.coordinates must be [longitude, latitude].")
];

module.exports = {
  createProviderValidator,
  nearbyProviderValidator,
  providerIdValidator,
  updateProviderValidator
};
