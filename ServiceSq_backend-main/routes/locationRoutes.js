const express = require("express");
const {
  getProviderLocation,
  updateLocation
} = require("../controllers/locationController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  locationBodyValidator,
  providerLocationValidator
} = require("../validators/locationValidators");

const router = express.Router();

router.put("/update", protect, authorizeRoles("provider"), locationBodyValidator, validate, updateLocation);
router.get("/provider/:id", protect, providerLocationValidator, validate, getProviderLocation);

module.exports = router;
