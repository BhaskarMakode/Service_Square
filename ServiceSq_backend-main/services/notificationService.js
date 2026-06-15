const Notification = require("../models/Notification");
const { publishEvent } = require("./realtimeService");

const createNotification = async ({
  userId,
  title,
  message,
  type,
  relatedResourceType,
  relatedResourceId
}) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    relatedResourceType,
    relatedResourceId
  });

  await publishEvent("notification.created", {
    userId: userId.toString(),
    notificationId: notification._id.toString(),
    type
  });

  return notification;
};

module.exports = {
  createNotification
};
