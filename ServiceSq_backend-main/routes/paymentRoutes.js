const express = require("express");
const {
  createPaymentIntent,
  getPaymentHistory,
  getProviderEarnings,
  verifyPayment
} = require("../controllers/paymentController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  createPaymentIntentValidator,
  paymentHistoryValidator,
  verifyPaymentValidator
} = require("../validators/paymentValidators");

const router = express.Router();

router.use(protect);

router.post(
  "/create-payment-intent",
  authorizeRoles("customer"),
  createPaymentIntentValidator,
  validate,
  createPaymentIntent
);
router.post("/verify", authorizeRoles("customer"), verifyPaymentValidator, validate, verifyPayment);
router.get("/history", paymentHistoryValidator, validate, getPaymentHistory);
router.get("/provider-earnings", authorizeRoles("provider"), getProviderEarnings);

module.exports = router;
