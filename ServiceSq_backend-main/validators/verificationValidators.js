const { body, param } = require("express-validator");

const uploadVerificationValidator = [
  body("documentType").trim().notEmpty().withMessage("documentType is required.").isLength({ max: 80 })
];

const reviewVerificationValidator = [
  param("id").isMongoId().withMessage("verification id must be valid."),
  body("status").isIn(["approved", "rejected"]).withMessage("status must be approved or rejected."),
  body("rejectionReason")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("rejectionReason must be at most 500 characters."),
  body("rejectionReason").custom((value, { req }) => {
    if (req.body.status === "rejected" && !value) {
      throw new Error("rejectionReason is required when rejecting verification.");
    }
    return true;
  })
];

module.exports = {
  reviewVerificationValidator,
  uploadVerificationValidator
};
