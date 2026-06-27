const { query } = require("express-validator");

const providerSearchValidator = [
  query("q").optional().trim().isLength({ max: 100 }).withMessage("q must be at most 100 characters."),
  query("latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("latitude is invalid."),
  query("longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("longitude is invalid."),
  query("radius").optional().isFloat({ min: 0.1, max: 100 }).withMessage("radius is invalid."),
  query("category").optional().trim().notEmpty().withMessage("category cannot be empty."),
  query("minRating").optional().isFloat({ min: 0, max: 5 }).withMessage("minRating is invalid."),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice is invalid."),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice is invalid."),
  query("availabilityStatus")
    .optional()
    .isIn(["available", "busy", "offline"])
    .withMessage("availabilityStatus is invalid."),
  query("sort")
    .optional()
    .isIn(["relevance", "rating", "price", "priceDesc", "newest"])
    .withMessage("sort is invalid."),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100.")
];

const searchHistoryValidator = [
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50.")
];

module.exports = {
  providerSearchValidator,
  searchHistoryValidator
};
