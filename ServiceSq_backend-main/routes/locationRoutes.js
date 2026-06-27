const express = require("express");
const {
  getProviderLocation,
  updateLocation
} = require("../controllers/locationController");
const protect = require("../middleware/auth");
const requireApprovedProvider = require("../middleware/approvedProvider");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  locationBodyValidator,
  providerLocationValidator
} = require("../validators/locationValidators");

const router = express.Router();

router.put("/update", protect, authorizeRoles("provider"), requireApprovedProvider, locationBodyValidator, validate, updateLocation);
router.get("/provider/:id", protect, providerLocationValidator, validate, getProviderLocation);

module.exports = router;
