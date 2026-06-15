const express = require("express");
const {
  getSubscriptionPlans,
  getSubscriptionStatus,
  upgradeSubscription
} = require("../controllers/subscriptionController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const { upgradeSubscriptionValidator } = require("../validators/subscriptionValidators");

const router = express.Router();

router.post(
  "/upgrade",
  protect,
  authorizeRoles("provider"),
  upgradeSubscriptionValidator,
  validate,
  upgradeSubscription
);
router.get("/plans", getSubscriptionPlans);
router.get("/status", protect, authorizeRoles("provider"), getSubscriptionStatus);

module.exports = router;
