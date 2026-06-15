const express = require("express");
const {
  getBookingAnalytics,
  getProviderAnalytics,
  getRevenueAnalytics,
  getUserAnalytics
} = require("../controllers/analyticsController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  topProvidersValidator,
  yearQueryValidator
} = require("../validators/analyticsValidators");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/revenue", yearQueryValidator, validate, getRevenueAnalytics);
router.get("/bookings", yearQueryValidator, validate, getBookingAnalytics);
router.get("/providers", topProvidersValidator, validate, getProviderAnalytics);
router.get("/users", yearQueryValidator, validate, getUserAnalytics);

module.exports = router;
