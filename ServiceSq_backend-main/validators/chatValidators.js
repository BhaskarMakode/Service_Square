const { body, param, query } = require("express-validator");

const sendMessageValidator = [
  body("bookingId").isMongoId().withMessage("bookingId must be valid."),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("message is required.")
    .isLength({ max: 2000 })
    .withMessage("message must be at most 2000 characters.")
];

const getChatValidator = [
  param("bookingId").isMongoId().withMessage("bookingId must be valid."),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100.")
];

module.exports = {
  getChatValidator,
  sendMessageValidator
};
