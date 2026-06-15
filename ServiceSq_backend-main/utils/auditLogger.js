const AuditLog = require("../models/AuditLog");

const auditLog = async ({ req, actorId, action, entityType, entityId, metadata = {} }) => {
  try {
    await AuditLog.create({
      actorId: actorId || (req && req.user && req.user._id),
      action,
      entityType,
      entityId,
      metadata,
      ip: req && req.ip,
      userAgent: req && req.get && req.get("user-agent")
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Audit logging failed:", error.message);
    }
  }
};

module.exports = auditLog;
