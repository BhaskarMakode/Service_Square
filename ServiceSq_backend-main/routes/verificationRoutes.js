const express = require("express");
const {
  getVerificationStatus,
  uploadVerificationDocument
} = require("../controllers/verificationController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { documentUpload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const { uploadVerificationValidator } = require("../validators/verificationValidators");

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorizeRoles("provider"),
  documentUpload.fields([
    { name: "document", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]),
  uploadVerificationValidator,
  validate,
  uploadVerificationDocument
);
router.get("/status", protect, authorizeRoles("provider"), getVerificationStatus);

module.exports = router;
