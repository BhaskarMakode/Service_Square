const { body, query } = require("express-validator");

const createTicketValidator = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("subject is required.")
    .isLength({ max: 150 })
    .withMessage("subject must be at most 150 characters."),
  body().custom((value) => {
    const issue = value.issue || value.description;
    if (!issue || !String(issue).trim()) throw new Error("issue is required.");
    if (String(issue).trim().length > 3000) throw new Error("issue must be at most 3000 characters.");
    return true;
  }),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("priority is invalid.")
];

const myTicketsValidator = [
  query("status")
    .optional()
    .isIn(["open", "in_progress", "resolved", "closed"])
    .withMessage("status is invalid."),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100.")
];

module.exports = {
  createTicketValidator,
  myTicketsValidator
};
