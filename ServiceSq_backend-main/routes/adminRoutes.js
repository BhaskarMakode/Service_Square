const express = require("express");
const {
  deleteUser,
  getDashboard,
  getProviders,
  getUsers,
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
  verifyProviderValidator
} = require("../validators/adminValidators");
const { reviewVerificationValidator } = require("../validators/verificationValidators");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", listUsersValidator, validate, getUsers);
router.get("/providers", listAdminProvidersValidator, validate, getProviders);
router.put("/provider/:id/verify", verifyProviderValidator, validate, verifyProvider);
router.put("/verification/:id", reviewVerificationValidator, validate, reviewVerification);
router.delete("/user/:id", deleteUserValidator, validate, deleteUser);

module.exports = router;
