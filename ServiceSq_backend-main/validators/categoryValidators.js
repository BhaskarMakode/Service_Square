const { body, param, query } = require("express-validator");

const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required.")
    .isLength({ max: 80 })
    .withMessage("name must be at most 80 characters."),
  body("icon")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage("icon must be at most 120 characters."),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("description must be at most 500 characters."),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean.")
];

const updateCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("category id must be valid."),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("name cannot be empty.")
    .isLength({ max: 80 })
    .withMessage("name must be at most 80 characters."),
  body("icon")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage("icon must be at most 120 characters."),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("description must be at most 500 characters."),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean.")
];

const deleteCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("category id must be valid.")
];

const listCategoriesValidator = [
  query("popular")
    .optional()
    .isBoolean()
    .withMessage("popular must be boolean."),
  query("includeInactive")
    .optional()
    .isBoolean()
    .withMessage("includeInactive must be boolean."),
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
  createCategoryValidator,
  deleteCategoryValidator,
  listCategoriesValidator,
  updateCategoryValidator
};
