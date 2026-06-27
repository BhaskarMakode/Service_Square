const express = require("express");
const {
  createTicket,
  getAllTickets,
  getMyTickets,
  updateTicket
} = require("../controllers/supportController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  createTicketValidator,
  myTicketsValidator
} = require("../validators/supportValidators");

const router = express.Router();

router.use(protect);

router.post("/create-ticket", createTicketValidator, validate, createTicket);
router.get("/my-tickets", myTicketsValidator, validate, getMyTickets);
router.get("/all", authorizeRoles("admin"), myTicketsValidator, validate, getAllTickets);
router.put("/:id", authorizeRoles("admin"), updateTicket);

module.exports = router;
