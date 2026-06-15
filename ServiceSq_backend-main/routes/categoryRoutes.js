const express = require("express");
const {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} = require("../controllers/categoryController");
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  createCategoryValidator,
  deleteCategoryValidator,
  listCategoriesValidator,
  updateCategoryValidator
} = require("../validators/categoryValidators");

const router = express.Router();

router.post("/create", protect, authorizeRoles("admin"), createCategoryValidator, validate, createCategory);
router.get("/", listCategoriesValidator, validate, getCategories);
router.put("/:id", protect, authorizeRoles("admin"), updateCategoryValidator, validate, updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategoryValidator, validate, deleteCategory);

module.exports = router;
