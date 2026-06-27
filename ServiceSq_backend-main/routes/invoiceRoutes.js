const express = require("express");
const {
  getAllInvoices,
  getInvoiceByBooking,
  getInvoiceHistory
} = require("../controllers/invoiceController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  invoiceBookingValidator,
  invoiceHistoryValidator
} = require("../validators/invoiceValidators");

const router = express.Router();

router.use(protect);

router.get("/admin/all", authorizeRoles("admin"), invoiceHistoryValidator, validate, getAllInvoices);
router.get("/user/history", invoiceHistoryValidator, validate, getInvoiceHistory);
router.get("/:bookingId", invoiceBookingValidator, validate, getInvoiceByBooking);

module.exports = router;
