const { body, param, query } = require("express-validator");

const listUsersValidator = [
  query("role").optional().isIn(["customer", "provider", "admin"]).withMessage("role is invalid."),
  query("isActive").optional().isBoolean().withMessage("isActive must be boolean."),
  query("search").optional().trim().isLength({ max: 80 }).withMessage("search is too long."),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100.")
];

const listAdminProvidersValidator = [
  query("verificationStatus")
    .optional()
    .isIn(["pending", "approved", "rejected"])
    .withMessage("verificationStatus is invalid."),
  query("category").optional().trim().notEmpty().withMessage("category cannot be empty."),
  query("availabilityStatus")
    .optional()
    .isIn(["available", "busy", "offline"])
    .withMessage("availabilityStatus is invalid."),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100.")
];

const verifyProviderValidator = [
  param("id").isMongoId().withMessage("provider id must be valid."),
  body("status").isIn(["approved", "rejected"]).withMessage("status must be approved or rejected."),
  body("rejectionReason")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("rejectionReason must be at most 500 characters.")
];

const providerDecisionValidator = [
  param("id").isMongoId().withMessage("provider id must be valid."),
  body("rejectionReason")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("rejectionReason must be at most 500 characters.")
];

const deleteUserValidator = [
  param("id").isMongoId().withMessage("user id must be valid.")
];

module.exports = {
  deleteUserValidator,
  listAdminProvidersValidator,
  listUsersValidator,
  providerDecisionValidator,
  verifyProviderValidator
};
