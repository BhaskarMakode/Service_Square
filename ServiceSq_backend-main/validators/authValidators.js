const { body } = require("express-validator");

const phoneValidator = () =>
  body("phone")
    .trim()
    .matches(/^\+?[1-9]\d{9,14}$/)
    .withMessage("phone must be a valid mobile number with country code support.");

const sendOtpValidator = [
  phoneValidator()
];

const verifyOtpValidator = [
  phoneValidator(),
  body("otp")
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("otp must be a 6 digit code.")
];

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required.")
    .isLength({ max: 80 })
    .withMessage("name must be at most 80 characters."),
  body("role")
    .isIn(["customer", "provider"])
    .withMessage("role must be customer or provider."),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("email must be valid.")
    .normalizeEmail(),
  body("avatar")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("avatar must be a valid URL."),
  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[1-9]\d{9,14}$/)
    .withMessage("phone must be valid.")
];

const refreshTokenValidator = [
  body("refreshToken")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("refreshToken must be a string.")
];

module.exports = {
  refreshTokenValidator,
  sendOtpValidator,
  verifyOtpValidator,
  registerValidator
};
