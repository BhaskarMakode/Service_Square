const { query } = require("express-validator");

const providerSearchValidator = [
  query("q").optional({ checkFalsy: true }).trim().isLength({ max: 100 }).withMessage("q must be at most 100 characters."),
  query("latitude").optional({ checkFalsy: true }).isFloat({ min: -90, max: 90 }).withMessage("latitude is invalid."),
  query("longitude").optional({ checkFalsy: true }).isFloat({ min: -180, max: 180 }).withMessage("longitude is invalid."),
  query("radius")
    .optional({ checkFalsy: true })
    .custom((value) => value === "anywhere" || (Number(value) >= 0.1 && Number(value) <= 1000))
    .withMessage("radius must be a positive number up to 1000km, or 'anywhere'."),
  query("category").optional({ checkFalsy: true }).trim().notEmpty().withMessage("category cannot be empty."),
  query("minRating").optional({ checkFalsy: true }).isFloat({ min: 0, max: 5 }).withMessage("minRating is invalid."),
  query("minPrice").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("minPrice is invalid."),
  query("maxPrice").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("maxPrice is invalid."),
  query("minExperience").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("minExperience is invalid."),
  query("availabilityStatus")
    .optional({ checkFalsy: true })
    .isIn(["available", "busy", "offline"])
    .withMessage("availabilityStatus is invalid."),
  query("sort")
    .optional({ checkFalsy: true })
    .isIn(["relevance", "distance", "nearest", "rating", "price", "priceDesc", "mostBooked", "newest"])
    .withMessage("sort is invalid."),
  query("page").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional({ checkFalsy: true }).isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100.")
];

const searchHistoryValidator = [
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50.")
];

module.exports = {
  providerSearchValidator,
  searchHistoryValidator
};
