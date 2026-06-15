const { body, param, query } = require("express-validator");

const addPortfolioValidator = [
  body("title").trim().notEmpty().withMessage("title is required.").isLength({ max: 120 }),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

const providerPortfolioValidator = [
  param("providerId").isMongoId().withMessage("providerId must be valid."),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100.")
];

const portfolioIdValidator = [
  param("id").isMongoId().withMessage("portfolio id must be valid.")
];

module.exports = {
  addPortfolioValidator,
  portfolioIdValidator,
  providerPortfolioValidator
};
