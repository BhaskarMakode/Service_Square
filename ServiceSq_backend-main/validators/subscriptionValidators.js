const { body } = require("express-validator");

const upgradeSubscriptionValidator = [
  body("planName").trim().notEmpty().withMessage("planName is required."),
  body("paymentMethod")
    .optional()
    .isIn(["mock", "card", "upi", "razorpay", "stripe"])
    .withMessage("paymentMethod is invalid.")
];

module.exports = {
  upgradeSubscriptionValidator
};
