const express = require("express");
const {
  getOnlineProviders,
  getProviderAvailability,
  toggleAvailability,
  updateWorkingHours
} = require("../controllers/availabilityController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  onlineProvidersValidator,
  providerAvailabilityValidator,
  toggleAvailabilityValidator,
  workingHourValidator
} = require("../validators/availabilityValidators");

const router = express.Router();

router.put(
  "/toggle",
  protect,
  authorizeRoles("provider"),
  toggleAvailabilityValidator,
  validate,
  toggleAvailability
);
router.get("/provider/:id", providerAvailabilityValidator, validate, getProviderAvailability);
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
