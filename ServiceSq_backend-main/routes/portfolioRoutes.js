const express = require("express");
const {
  addPortfolio,
  deletePortfolio,
  getProviderPortfolio
} = require("../controllers/portfolioController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { portfolioImageUpload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const {
  addPortfolioValidator,
  portfolioIdValidator,
  providerPortfolioValidator
} = require("../validators/portfolioValidators");

const router = express.Router();
const maxPortfolioImages = Number(process.env.PORTFOLIO_MAX_IMAGES || 5);

router.post(
  "/add",
  protect,
  authorizeRoles("provider"),
  portfolioImageUpload.array("images", maxPortfolioImages),
  addPortfolioValidator,
  validate,
  addPortfolio
);
router.get("/:providerId", providerPortfolioValidator, validate, getProviderPortfolio);
router.delete("/:id", protect, authorizeRoles("provider"), portfolioIdValidator, validate, deletePortfolio);

module.exports = router;
