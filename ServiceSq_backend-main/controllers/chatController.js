const Booking = require("../models/Booking");
const ChatMessage = require("../models/ChatMessage");
const ProviderProfile = require("../models/ProviderProfile");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");
const { publishEvent } = require("../services/realtimeService");

const getParticipantContext = async (bookingId, user) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  const provider = await ProviderProfile.findById(booking.providerId);

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const isCustomer = booking.customerId.toString() === user._id.toString();
  const isProvider = provider.userId.toString() === user._id.toString();

  if (!isCustomer && !isProvider) {
    throw new AppError("You are not allowed to access this chat.", 403);
  }

  return {
    booking,
    provider,
    receiverId: isCustomer ? provider.userId : booking.customerId
  };
};

const sendMessage = asyncHandler(async (req, res) => {
  const context = await getParticipantContext(req.body.bookingId, req.user);

  const chatMessage = await ChatMessage.create({
    bookingId: context.booking._id,
    senderId: req.user._id,
    receiverId: context.receiverId,
    message: req.body.message
  });

  await publishEvent("chat.message_sent", {
    bookingId: context.booking._id.toString(),
    messageId: chatMessage._id.toString(),
    senderId: req.user._id.toString(),
    receiverId: context.receiverId.toString()
  });

  await chatMessage.populate([
    { path: "senderId", select: "name avatar role" },
    { path: "receiverId", select: "name avatar role" }
  ]);

  return sendSuccess(res, 201, "Message sent successfully.", {
    message: chatMessage
  });
});

const getChatByBooking = asyncHandler(async (req, res) => {
  await getParticipantContext(req.params.bookingId, req.user);

  const { page, limit, skip } = getPagination(req.query);

  const [messages, total] = await Promise.all([
    ChatMessage.find({ bookingId: req.params.bookingId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "name avatar role")
      .populate("receiverId", "name avatar role"),
    ChatMessage.countDocuments({ bookingId: req.params.bookingId })
  ]);

  return sendSuccess(res, 200, "Chat messages fetched successfully.", {
    messages,
    pagination: buildPagination({ page, limit, total })
  });
});

module.exports = {
  getChatByBooking,
  sendMessage
};
