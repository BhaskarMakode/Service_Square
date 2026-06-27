const express = require("express");
const {
  getOnlineProviders,
  getProviderAvailability,
  getProviderSlots,
  toggleAvailability,
  updateWorkingHours
} = require("../controllers/availabilityController");
const protect = require("../middleware/auth");
const requireApprovedProvider = require("../middleware/approvedProvider");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  onlineProvidersValidator,
  providerAvailabilityValidator,
  providerSlotsValidator,
  toggleAvailabilityValidator,
  workingHourValidator
} = require("../validators/availabilityValidators");

const router = express.Router();

router.put(
  "/toggle",
  protect,
  authorizeRoles("provider"),
  requireApprovedProvider,
  toggleAvailabilityValidator,
  validate,
  toggleAvailability
);
router.get("/provider/:id", providerAvailabilityValidator, validate, getProviderAvailability);
router.get("/provider/:id/slots", providerSlotsValidator, validate, getProviderSlots);
router.put(
  "/working-hours",
  protect,
  authorizeRoles("provider"),
  workingHourValidator,
  validate,
  updateWorkingHours
);
router.get("/online-providers", onlineProvidersValidator, validate, getOnlineProviders);

module.exports = router;
