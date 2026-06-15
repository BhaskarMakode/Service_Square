const { body, param, query } = require("express-validator");

const locationBodyValidator = [
  body("latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("latitude is invalid."),
  body("longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("longitude is invalid."),
  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("location.coordinates must be [longitude, latitude]."),
  body("location.coordinates.0").optional().isFloat({ min: -180, max: 180 }).withMessage("longitude is invalid."),
  body("location.coordinates.1").optional().isFloat({ min: -90, max: 90 }).withMessage("latitude is invalid.")
];

const providerLocationValidator = [
  param("id").isMongoId().withMessage("provider id must be valid."),
  query("latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("latitude is invalid."),
  query("longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("longitude is invalid."),
  query().custom((value, { req }) => {
    const hasLatitude = req.query.latitude !== undefined;
    const hasLongitude = req.query.longitude !== undefined;

    if (hasLatitude !== hasLongitude) {
      throw new Error("latitude and longitude must be provided together.");
    }

    return true;
  })
];

module.exports = {
  locationBodyValidator,
  providerLocationValidator
};
