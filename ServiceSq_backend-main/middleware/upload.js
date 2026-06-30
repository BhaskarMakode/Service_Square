const multer = require("multer");
const AppError = require("../utils/AppError");

const maxSizeMb = Number(process.env.UPLOAD_MAX_SIZE_MB || 5);

const makeUpload = (allowedMimeTypes) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxSizeMb * 1024 * 1024
    },
    fileFilter(req, file, cb) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new AppError("Unsupported file type.", 400));
      }

      return cb(null, true);
    }
  });
};

const profileImageUpload = makeUpload(["image/jpeg", "image/png", "image/webp"]);
const documentUpload = makeUpload(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const portfolioImageUpload = makeUpload(["image/jpeg", "image/png", "image/webp"]);

module.exports = {
  documentUpload,
  portfolioImageUpload,
  profileImageUpload
};
