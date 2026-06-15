const express = require("express");
const {
  deleteNotification,
  getNotifications,
  markNotificationRead
} = require("../controllers/notificationController");
const protect = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  listNotificationsValidator,
  notificationIdValidator
} = require("../validators/notificationValidators");

const router = express.Router();

router.use(protect);

router.get("/", listNotificationsValidator, validate, getNotifications);
router.put("/:id/read", notificationIdValidator, validate, markNotificationRead);
router.delete("/:id", notificationIdValidator, validate, deleteNotification);

module.exports = router;
