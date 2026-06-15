const { body, query } = require("express-validator");

const createPaymentIntentValidator = [
  body("bookingId")
    .isMongoId()
    .withMessage("bookingId must be valid."),
  body("paymentMethod")
    .optional()
    .isIn(["mock", "card", "upi", "cash", "razorpay", "stripe"])
    .withMessage("paymentMethod is invalid.")
];

const verifyPaymentValidator = [
  body("paymentId")
    .isMongoId()
    .withMessage("paymentId must be valid."),
  body("transactionId")
    .trim()
    .notEmpty()
    .withMessage("transactionId is required."),
  body("clientSecret")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("clientSecret must be a string."),
  body("signature")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("signature must be a string.")
];

const paymentHistoryValidator = [
  query("paymentStatus")
    .optional()
    .isIn(["pending", "succeeded", "failed", "refunded"])
    .withMessage("paymentStatus is invalid."),
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
  createPaymentIntentValidator,
  paymentHistoryValidator,
  verifyPaymentValidator
};
