const Notification = require("../models/Notification");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");

const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { userId: req.user._id };

  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Notifications fetched successfully.", {
    notifications,
    pagination: buildPagination({ page, limit, total })
  });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  notification.isRead = true;
  await notification.save();

  return sendSuccess(res, 200, "Notification marked as read.", {
    notification
  });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  return sendSuccess(res, 200, "Notification deleted successfully.");
});

module.exports = {
  deleteNotification,
  getNotifications,
  markNotificationRead
};
