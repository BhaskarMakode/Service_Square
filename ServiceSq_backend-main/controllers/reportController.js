const ProviderProfile = require("../models/ProviderProfile");
const Report = require("../models/Report");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");

const openReportStatuses = ["pending", "reviewed"];

const ensureNoOpenDuplicateReport = async ({ reportedBy, targetUser, targetType }) => {
  const existing = await Report.findOne({
    reportedBy,
    targetUser,
    targetType,
    status: { $in: openReportStatuses }
  });

  if (existing) {
    throw new AppError("You have already reported this target and it is under review.", 409);
  }
};

const createReport = async ({ req, targetUser, targetProvider, targetType }) => {
  if (targetUser.toString() === req.user._id.toString()) {
    throw new AppError("You cannot report yourself.", 400);
  }

  await ensureNoOpenDuplicateReport({
    reportedBy: req.user._id,
    targetUser,
    targetType
  });

  return Report.create({
    reportedBy: req.user._id,
    targetUser,
    targetProvider,
    targetType,
    reason: req.body.reason,
    description: req.body.description,
    status: "pending",
    adminAction: "none"
  });
};

const reportUser = asyncHandler(async (req, res) => {
  const target = await User.findOne({ _id: req.body.targetUser, deletedAt: null });

  if (!target) {
    throw new AppError("Target user not found.", 404);
  }

  const report = await createReport({
    req,
    targetUser: target._id,
    targetType: "user"
  });

  return sendSuccess(res, 201, "User report submitted successfully.", {
    report
  });
});

const reportProvider = asyncHandler(async (req, res) => {
  const provider = await ProviderProfile.findById(req.body.providerId).select("userId category");

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const report = await createReport({
    req,
    targetUser: provider.userId,
    targetProvider: provider._id,
    targetType: "provider"
  });

  return sendSuccess(res, 201, "Provider report submitted successfully.", {
    report
  });
});

const getAllReports = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.targetType) filter.targetType = req.query.targetType;

  const [reports, total] = await Promise.all([
    Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("reportedBy", "name phone role")
      .populate("targetUser", "name phone role isActive")
      .populate("targetProvider", "category rating reviewsCount"),
    Report.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Reports fetched successfully.", {
    reports,
    pagination: buildPagination({ page, limit, total })
  });
});

const moderateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    throw new AppError("Report not found.", 404);
  }

  report.status = req.body.status;
  report.adminAction = req.body.adminAction;
  report.actionNote = req.body.actionNote;
  report.actionedBy = req.user._id;
  report.actionedAt = new Date();
  await report.save();

  await auditLog({
    req,
    action: "report.moderated",
    entityType: "Report",
    entityId: report._id,
    metadata: {
      status: report.status,
      adminAction: report.adminAction
    }
  });

  await report.populate([
    { path: "reportedBy", select: "name phone role" },
    { path: "targetUser", select: "name phone role isActive" },
    { path: "targetProvider", select: "category rating reviewsCount" }
  ]);

  return sendSuccess(res, 200, "Report action updated successfully.", {
    report
  });
});

module.exports = {
  getAllReports,
  moderateReport,
  reportProvider,
  reportUser
};
