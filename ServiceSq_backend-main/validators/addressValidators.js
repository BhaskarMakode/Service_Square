const { body, param } = require("express-validator");

const addressIdValidator = [
  param("id").isMongoId().withMessage("address id must be valid.")
];

const requiredAddressValidator = [
  body("fullName").trim().notEmpty().withMessage("fullName is required.").isLength({ max: 80 }),
  body("phone")
    .trim()
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage("phone must be a valid phone number."),
  body("houseNo").trim().notEmpty().withMessage("houseNo is required.").isLength({ max: 80 }),
  body("street").trim().notEmpty().withMessage("street is required.").isLength({ max: 160 }),
  body("city").trim().notEmpty().withMessage("city is required.").isLength({ max: 80 }),
  body("state").trim().notEmpty().withMessage("state is required.").isLength({ max: 80 }),
  body("pincode")
    .trim()
    .matches(/^[0-9]{4,10}$/)
    .withMessage("pincode must contain 4-10 digits."),
  body("landmark").optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be boolean.").toBoolean()
];

const updateAddressValidator = [
  ...addressIdValidator,
  body("fullName").optional().trim().notEmpty().withMessage("fullName cannot be empty.").isLength({ max: 80 }),
  body("phone")
    .optional()
    .trim()
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage("phone must be a valid phone number."),
  body("houseNo").optional().trim().notEmpty().withMessage("houseNo cannot be empty.").isLength({ max: 80 }),
  body("street").optional().trim().notEmpty().withMessage("street cannot be empty.").isLength({ max: 160 }),
  body("city").optional().trim().notEmpty().withMessage("city cannot be empty.").isLength({ max: 80 }),
  body("state").optional().trim().notEmpty().withMessage("state cannot be empty.").isLength({ max: 80 }),
  body("pincode")
    .optional()
    .trim()
    .matches(/^[0-9]{4,10}$/)
    .withMessage("pincode must contain 4-10 digits."),
  body("landmark").optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be boolean.").toBoolean()
];

module.exports = {
  addressIdValidator,
  requiredAddressValidator,
  updateAddressValidator
};
