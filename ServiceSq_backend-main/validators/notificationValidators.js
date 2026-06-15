const { param, query } = require("express-validator");

const listNotificationsValidator = [
  query("isRead")
    .optional()
    .isBoolean()
    .withMessage("isRead must be boolean."),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be greater than 0."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100.")
];

const notificationIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("notification id must be valid.")
];

module.exports = {
  listNotificationsValidator,
  notificationIdValidator
};
