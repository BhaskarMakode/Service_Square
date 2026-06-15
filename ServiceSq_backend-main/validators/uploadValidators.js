const { body, param } = require("express-validator");

const documentMetadataValidator = [
  body("documentType")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage("documentType must be at most 80 characters.")
];

const uploadIdValidator = [
  param("id").isMongoId().withMessage("upload id must be valid.")
];

module.exports = {
  documentMetadataValidator,
  uploadIdValidator
};
