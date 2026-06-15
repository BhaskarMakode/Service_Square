const { query } = require("express-validator");

const yearQueryValidator = [
  query("year").optional().isInt({ min: 2000, max: 2100 }).withMessage("year must be valid.")
];

const topProvidersValidator = [
  ...yearQueryValidator,
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50.")
];

module.exports = {
  topProvidersValidator,
  yearQueryValidator
};
