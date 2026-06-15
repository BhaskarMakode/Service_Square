const { param, query } = require("express-validator");

const invoiceBookingValidator = [
  param("bookingId").isMongoId().withMessage("bookingId must be valid.")
];

const invoiceHistoryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100.")
];

module.exports = {
  invoiceBookingValidator,
  invoiceHistoryValidator
};
