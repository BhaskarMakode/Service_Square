const express = require("express");
const {
  createTicket,
  getMyTickets
} = require("../controllers/supportController");
const protect = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createTicketValidator,
  myTicketsValidator
} = require("../validators/supportValidators");

const router = express.Router();

router.use(protect);

router.post("/create-ticket", createTicketValidator, validate, createTicket);
router.get("/my-tickets", myTicketsValidator, validate, getMyTickets);

module.exports = router;
