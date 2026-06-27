const express = require("express");
const {
  createPaymentIntent,
  getAllPayments,
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
router.get("/admin/all", authorizeRoles("admin"), paymentHistoryValidator, validate, getAllPayments);
router.get("/history", paymentHistoryValidator, validate, getPaymentHistory);
router.get("/provider-earnings", authorizeRoles("provider"), getProviderEarnings);

// Public (authenticated) endpoint — returns Razorpay publishable key for the frontend
router.get("/razorpay-key", (req, res) => {
  res.json({ success: true, data: { key: process.env.RAZORPAY_KEY_ID || "" } });
});

module.exports = router;
