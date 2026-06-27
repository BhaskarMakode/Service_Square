const ProviderProfile = require("../models/ProviderProfile");
const Upload = require("../models/Upload");
const Verification = require("../models/Verification");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { storeDocument } = require("../services/storageService");

const getCurrentProvider = async (userId) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  return provider;
};

const getDocumentFile = (req) => {
  if (req.file) return req.file;
  if (req.files && req.files.document && req.files.document[0]) return req.files.document[0];
  if (req.files && req.files.file && req.files.file[0]) return req.files.file[0];
  return null;
};

const createVerificationUpload = async ({ req, provider, file }) => {
  const stored = await storeDocument(file);
  const upload = await Upload.create({
    userId: req.user._id,
    providerId: provider._id,
    type: "verification_document",
    documentType: req.body.documentType,
    originalName: file.originalname,
    fileName: stored.fileName,
    mimeType: file.mimetype,
    size: stored.size,
    path: stored.path,
    url: "/pending",
    storageProvider: "local",
    metadata: {
      purpose: "kyc"
    }
  });

  upload.url = `/api/upload/${upload._id}`;
  await upload.save();

  return upload;
};

const uploadVerificationDocument = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  const file = getDocumentFile(req);

  if (!file) {
    throw new AppError("Verification document is required.", 400);
  }

  const activeVerification = await Verification.findOne({
    providerId: provider._id,
    verificationStatus: "approved"
  });

  if (activeVerification) {
    throw new AppError("This provider is already approved.", 409);
  }

  const upload = await createVerificationUpload({ req, provider, file });
  const verification = await Verification.create({
    providerId: provider._id,
    documentType: req.body.documentType,
    documentImage: {
      url: upload.url,
      uploadId: upload._id,
      originalName: upload.originalName,
      mimeType: upload.mimeType,
      size: upload.size,
      storageProvider: upload.storageProvider
    },
    verificationStatus: "pending",
    submittedAt: new Date()
  });

  provider.verificationStatus = "pending";
  provider.rejectionReason = undefined;
  provider.verifiedAt = null;
  provider.verifiedBy = undefined;
  await provider.save();

  await auditLog({
    req,
    action: "verification.uploaded",
    entityType: "Verification",
    entityId: verification._id,
    metadata: {
      providerId: provider._id,
      documentType: verification.documentType
    }
  });

  return sendSuccess(res, 201, "Verification document uploaded successfully.", {
    verification
  });
});

const getVerificationStatus = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  const verification = await Verification.findOne({ providerId: provider._id }).sort({ submittedAt: -1 });

  return sendSuccess(res, 200, "Verification status fetched successfully.", {
    providerStatus: provider.verificationStatus,
    verification
  });
});

const reviewVerification = asyncHandler(async (req, res) => {
  const verification = await Verification.findById(req.params.id);

  if (!verification) {
    throw new AppError("Verification request not found.", 404);
  }

  const provider = await ProviderProfile.findById(verification.providerId);

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  verification.verificationStatus = req.body.status;
  verification.rejectionReason = req.body.status === "rejected" ? req.body.rejectionReason : undefined;
  verification.reviewedAt = new Date();
  verification.reviewedBy = req.user._id;
  await verification.save();

  provider.verificationStatus = req.body.status;
  provider.verifiedAt = req.body.status === "approved" ? new Date() : null;
  provider.verifiedBy = req.user._id;
  provider.rejectionReason = req.body.status === "rejected" ? req.body.rejectionReason : undefined;
  await provider.save();

  await auditLog({
    req,
    action: "verification.reviewed",
    entityType: "Verification",
    entityId: verification._id,
    metadata: {
      providerId: provider._id,
      status: req.body.status
    }
  });

  return sendSuccess(res, 200, "Verification request updated successfully.", {
    verification,
    provider
  });
});

module.exports = {
  getVerificationStatus,
  reviewVerification,
  uploadVerificationDocument
};
