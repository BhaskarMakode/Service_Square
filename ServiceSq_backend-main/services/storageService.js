const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const AppError = require("../utils/AppError");

const uploadRoot = path.resolve(process.env.UPLOAD_DIR || "uploads");

const ensureDirectory = (directory) => {
  fs.mkdirSync(directory, { recursive: true });
};

const getExtension = (mimeType) => {
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "application/pdf") return ".pdf";
  return "";
};

const storeImage = async (file, folder, options = {}) => {
  const extension = getExtension(file.mimetype);
  const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
  const directory = path.join(uploadRoot, folder);
  const filePath = path.join(directory, fileName);

  ensureDirectory(directory);

  let image = sharp(file.buffer);

  if (options.resize !== false) {
    image = image.resize({
      width: options.width || 512,
      height: options.height || 512,
      fit: options.fit || "cover"
    });
  }

  if (extension === ".png") {
    await image.png({ quality: 85, compressionLevel: 8 }).toFile(filePath);
  } else {
    await image.jpeg({ quality: 82, mozjpeg: true }).toFile(filePath);
  }

  const stats = fs.statSync(filePath);

  return {
    fileName,
    path: filePath,
    size: stats.size
  };
};

const storeProfileImage = async (file) => {
  return storeImage(file, "profiles", {
    width: 512,
    height: 512,
    fit: "cover"
  });
};

const storePortfolioImage = async (file) => {
  return storeImage(file, "portfolio", {
    width: 1280,
    height: 960,
    fit: "inside"
  });
};

const storeDocument = async (file) => {
  const extension = getExtension(file.mimetype);

  if (!extension) {
    throw new AppError("Unsupported file type.", 400);
  }

  const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
  const directory = path.join(uploadRoot, "documents");
  const filePath = path.join(directory, fileName);

  ensureDirectory(directory);
  fs.writeFileSync(filePath, file.buffer);

  return {
    fileName,
    path: filePath,
    size: file.size
  };
};

module.exports = {
  storeDocument,
  storePortfolioImage,
  storeProfileImage
};
