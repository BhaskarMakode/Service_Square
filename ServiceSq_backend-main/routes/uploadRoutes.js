const express = require("express");
const {
  getUploadById,
  uploadDocuments,
  uploadProfileImage
} = require("../controllers/uploadController");
const protect = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const authorizeRoles = require("../middleware/role");
const { documentUpload, profileImageUpload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const {
  documentMetadataValidator,
  uploadIdValidator
} = require("../validators/uploadValidators");

const router = express.Router();

router.post("/profile-image", protect, profileImageUpload.single("file"), uploadProfileImage);
router.post(
  "/documents",
  protect,
  authorizeRoles("provider"),
  documentUpload.single("file"),
  documentMetadataValidator,
  validate,
  uploadDocuments
);
router.get("/:id", optionalAuth, uploadIdValidator, validate, getUploadById);

module.exports = router;
