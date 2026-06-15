const express = require("express");
const {
  getChatByBooking,
  sendMessage
} = require("../controllers/chatController");
const protect = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  getChatValidator,
  sendMessageValidator
} = require("../validators/chatValidators");

const router = express.Router();

router.use(protect);

router.post("/send", sendMessageValidator, validate, sendMessage);
router.get("/:bookingId", getChatValidator, validate, getChatByBooking);

module.exports = router;
