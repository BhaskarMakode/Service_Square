const express = require("express");
const {
  getInvoiceByBooking,
  getInvoiceHistory
} = require("../controllers/invoiceController");
const protect = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  invoiceBookingValidator,
  invoiceHistoryValidator
} = require("../validators/invoiceValidators");

const router = express.Router();

router.use(protect);

router.get("/user/history", invoiceHistoryValidator, validate, getInvoiceHistory);
router.get("/:bookingId", invoiceBookingValidator, validate, getInvoiceByBooking);

module.exports = router;
