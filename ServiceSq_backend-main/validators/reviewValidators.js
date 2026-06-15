const { body, param, query } = require("express-validator");

const addReviewValidator = [
  body("bookingId")
    .isMongoId()
    .withMessage("bookingId must be a valid MongoDB ObjectId."),
  body("providerId")
    .optional()
    .isMongoId()
    .withMessage("providerId must be a valid MongoDB ObjectId."),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be an integer between 1 and 5."),
  body("comment")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("comment must be at most 1000 characters.")
];

const providerReviewValidator = [
  param("providerId")
    .isMongoId()
    .withMessage("providerId must be a valid provider profile ObjectId."),
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
  addReviewValidator,
  providerReviewValidator
};
