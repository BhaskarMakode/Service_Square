const path = require("path");

const ProviderProfile = require("../models/ProviderProfile");
const Upload = require("../models/Upload");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { storeDocument, storeProfileImage } = require("../services/storageService");

const ensureFile = (req) => {
  if (!req.file) {
    throw new AppError("File is required.", 400);
  }
};

const createUploadRecord = async ({ req, stored, type, documentType, providerId }) => {
  const upload = await Upload.create({
    userId: req.user._id,
    providerId,
    type,
    documentType,
    originalName: req.file.originalname,
    fileName: stored.fileName,
    mimeType: req.file.mimetype,
    size: stored.size,
    path: stored.path,
    url: "/pending",
    storageProvider: "local"
  });

  upload.url = `/api/upload/${upload._id}`;
  await upload.save();

  return upload;
};

const uploadProfileImage = asyncHandler(async (req, res) => {
  ensureFile(req);

  const stored = await storeProfileImage(req.file);
  const upload = await createUploadRecord({
    req,
    stored,
    type: "profile_image"
  });

  req.user.avatar = upload.url;
  await req.user.save();

  await auditLog({
    req,
    action: "upload.profile_image",
    entityType: "Upload",
    entityId: upload._id
  });

  return sendSuccess(res, 201, "Profile image uploaded successfully.", {
    upload,
    user: req.user.toSafeObject()
  });
});

const uploadDocuments = asyncHandler(async (req, res) => {
  ensureFile(req);

  const provider = await ProviderProfile.findOne({ userId: req.user._id });

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const stored = await storeDocument(req.file);
  const upload = await createUploadRecord({
    req,
    stored,
    type: "document",
    documentType: req.body.documentType,
    providerId: provider._id
  });

  await auditLog({
    req,
    action: "upload.document",
    entityType: "Upload",
    entityId: upload._id,
    metadata: {
      providerId: provider._id,
      documentType: req.body.documentType
    }
  });

  return sendSuccess(res, 201, "Document uploaded successfully.", {
    upload
  });
});

const getUploadById = asyncHandler(async (req, res) => {
  const upload = await Upload.findById(req.params.id);

  if (!upload) {
    throw new AppError("Upload not found.", 404);
  }

  if (["document", "verification_document"].includes(upload.type)) {
    if (!req.user) {
      throw new AppError("Authentication token is required.", 401);
    }

    const isOwner = upload.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new AppError("You are not allowed to access this document.", 403);
    }
  }

  return res.sendFile(path.resolve(upload.path));
});

module.exports = {
  getUploadById,
  uploadDocuments,
  uploadProfileImage
};
