const Portfolio = require("../models/Portfolio");
const ProviderProfile = require("../models/ProviderProfile");
const Upload = require("../models/Upload");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");
const { storePortfolioImage } = require("../services/storageService");

const maxPortfolioImages = Number(process.env.PORTFOLIO_MAX_IMAGES || 5);

const getCurrentProvider = async (userId) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  return provider;
};

const createPortfolioImage = async ({ req, provider, file }) => {
  const stored = await storePortfolioImage(file);
  const upload = await Upload.create({
    userId: req.user._id,
    providerId: provider._id,
    type: "portfolio_image",
    originalName: file.originalname,
    fileName: stored.fileName,
    mimeType: file.mimetype,
    size: stored.size,
    path: stored.path,
    url: "/pending",
    storageProvider: "local",
    metadata: {
      purpose: "portfolio"
    }
  });

  upload.url = `/api/upload/${upload._id}`;
  await upload.save();

  return {
    url: upload.url,
    uploadId: upload._id,
    originalName: upload.originalName,
    mimeType: upload.mimeType,
    size: upload.size,
    storageProvider: upload.storageProvider
  };
};

const addPortfolio = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  const files = req.files || [];

  if (!files.length) {
    throw new AppError("At least one portfolio image is required.", 400);
  }

  if (files.length > maxPortfolioImages) {
    throw new AppError(`A maximum of ${maxPortfolioImages} portfolio images can be uploaded.`, 400);
  }

  const images = [];

  for (const file of files) {
    images.push(await createPortfolioImage({ req, provider, file }));
  }

  const portfolio = await Portfolio.create({
    providerId: provider._id,
    title: req.body.title,
    description: req.body.description,
    images
  });

  await auditLog({
    req,
    action: "portfolio.created",
    entityType: "Portfolio",
    entityId: portfolio._id,
    metadata: {
      providerId: provider._id,
      images: images.length
    }
  });

  return sendSuccess(res, 201, "Portfolio item added successfully.", {
    portfolio
  });
});

const getProviderPortfolio = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const provider = await ProviderProfile.findById(req.params.providerId).select("_id userId category");

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const [portfolio, total] = await Promise.all([
    Portfolio.find({ providerId: provider._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Portfolio.countDocuments({ providerId: provider._id })
  ]);

  return sendSuccess(res, 200, "Portfolio fetched successfully.", {
    provider,
    portfolio,
    pagination: buildPagination({ page, limit, total })
  });
});

const deletePortfolio = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    throw new AppError("Portfolio item not found.", 404);
  }

  if (portfolio.providerId.toString() !== provider._id.toString()) {
    throw new AppError("You are not allowed to delete this portfolio item.", 403);
  }

  await portfolio.deleteOne();

  await auditLog({
    req,
    action: "portfolio.deleted",
    entityType: "Portfolio",
    entityId: portfolio._id,
    metadata: {
      providerId: provider._id
    }
  });

  return sendSuccess(res, 200, "Portfolio item deleted successfully.", {
    deletedPortfolioId: req.params.id
  });
});

module.exports = {
  addPortfolio,
  deletePortfolio,
  getProviderPortfolio
};
