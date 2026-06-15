const express = require("express");
const {
  clearSearchHistory,
  getSearchHistory,
  getRecommendedProviders,
  getTrendingProviders,
  searchProviders
} = require("../controllers/searchController");
const optionalAuth = require("../middleware/optionalAuth");
const protect = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  providerSearchValidator,
  searchHistoryValidator
} = require("../validators/searchValidators");

const router = express.Router();

router.get("/providers", optionalAuth, providerSearchValidator, validate, searchProviders);
router.get("/trending", providerSearchValidator, validate, getTrendingProviders);
router.get("/recommended", protect, providerSearchValidator, validate, getRecommendedProviders);
router.get("/history", protect, searchHistoryValidator, validate, getSearchHistory);
router.delete("/history", protect, clearSearchHistory);

module.exports = router;
