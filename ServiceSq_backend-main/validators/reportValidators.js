const { body, param, query } = require("express-validator");

const reportReasonValidator = [
  body("reason").trim().notEmpty().withMessage("reason is required.").isLength({ max: 120 }),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

const reportUserValidator = [
  body("targetUser").isMongoId().withMessage("targetUser must be valid."),
  ...reportReasonValidator
];

const reportProviderValidator = [
  body("providerId").isMongoId().withMessage("providerId must be valid."),
  ...reportReasonValidator
];

const listReportsValidator = [
  query("status")
    .optional()
    .isIn(["pending", "reviewed", "dismissed", "action_taken"])
    .withMessage("status is invalid."),
  query("targetType").optional().isIn(["user", "provider"]).withMessage("targetType is invalid."),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100.")
];

const moderateReportValidator = [
  param("id").isMongoId().withMessage("report id must be valid."),
  body("status")
    .isIn(["pending", "reviewed", "dismissed", "action_taken"])
    .withMessage("status is invalid."),
  body("adminAction")
    .isIn(["none", "warning", "suspended", "dismissed", "other"])
    .withMessage("adminAction is invalid."),
  body("actionNote").optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

module.exports = {
  listReportsValidator,
  moderateReportValidator,
  reportProviderValidator,
  reportUserValidator
};
