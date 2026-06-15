const express = require("express");
const {
  getAllReports,
  moderateReport,
  reportProvider,
  reportUser
} = require("../controllers/reportController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  listReportsValidator,
  moderateReportValidator,
  reportProviderValidator,
  reportUserValidator
} = require("../validators/reportValidators");

const router = express.Router();

router.post("/user", protect, reportUserValidator, validate, reportUser);
router.post("/provider", protect, reportProviderValidator, validate, reportProvider);
router.get("/all", protect, authorizeRoles("admin"), listReportsValidator, validate, getAllReports);
router.put("/:id/action", protect, authorizeRoles("admin"), moderateReportValidator, validate, moderateReport);

module.exports = router;
