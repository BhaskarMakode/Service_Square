const express = require("express");
const {
  deleteUser,
  getDashboard,
  getProviderDetail,
  getPendingProviders,
  getProviders,
  getVerifiedProviders,
  getUsers,
  approveProvider,
  rejectProvider,
  verifyProvider
} = require("../controllers/adminController");
const { reviewVerification } = require("../controllers/verificationController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  deleteUserValidator,
  listAdminProvidersValidator,
  listUsersValidator,
  providerDecisionValidator,
  verifyProviderValidator
} = require("../validators/adminValidators");
const { reviewVerificationValidator } = require("../validators/verificationValidators");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", listUsersValidator, validate, getUsers);
router.get("/providers/pending", listAdminProvidersValidator, validate, getPendingProviders);
router.get("/providers/verified", listAdminProvidersValidator, validate, getVerifiedProviders);
router.get("/providers", listAdminProvidersValidator, validate, getProviders);
router.get("/provider/:id", getProviderDetail);
router.put("/provider/:id/verify", verifyProviderValidator, validate, verifyProvider);
router.put("/provider/:id/reject", providerDecisionValidator, validate, rejectProvider);
router.put("/provider/:id/approve", providerDecisionValidator, validate, approveProvider);
router.put("/verification/:id", reviewVerificationValidator, validate, reviewVerification);
router.delete("/user/:id", deleteUserValidator, validate, deleteUser);

module.exports = router;
