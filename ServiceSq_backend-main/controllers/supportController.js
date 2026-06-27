const SupportTicket = require("../models/SupportTicket");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");

const createTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.create({
    userId: req.user._id,
    subject: req.body.subject,
    issue: req.body.issue || req.body.description,
    priority: req.body.priority || "medium"
  });

  return sendSuccess(res, 201, "Support ticket created successfully.", {
    ticket
  });
});

const getAllTickets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = req.query.status ? { status: req.query.status } : {};
  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("userId", "name phone email role avatar"),
    SupportTicket.countDocuments(filter)
  ]);
  return sendSuccess(res, 200, "Support tickets fetched successfully.", {
    tickets,
    pagination: buildPagination({ page, limit, total })
  });
});

const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    { $set: { ...(req.body.status && { status: req.body.status }), ...(req.body.priority && { priority: req.body.priority }) } },
    { new: true, runValidators: true }
  ).populate("userId", "name phone email role avatar");
  if (!ticket) return res.status(404).json({ success: false, message: "Support ticket not found." });
  return sendSuccess(res, 200, "Support ticket updated successfully.", { ticket });
});

const getMyTickets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { userId: req.user._id };

  if (req.query.status) filter.status = req.query.status;

  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    SupportTicket.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Support tickets fetched successfully.", {
    tickets,
    pagination: buildPagination({ page, limit, total })
  });
});

module.exports = {
  createTicket,
  getAllTickets,
  updateTicket,
  getMyTickets
};
