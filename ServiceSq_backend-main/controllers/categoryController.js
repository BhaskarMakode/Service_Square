const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { buildPagination, getPagination } = require("../utils/pagination");
const slugify = require("../utils/slugify");

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    icon: req.body.icon,
    description: req.body.description,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });

  await auditLog({
    req,
    action: "category.created",
    entityType: "Category",
    entityId: category._id
  });

  return sendSuccess(res, 201, "Category created successfully.", {
    category
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { deletedAt: null };

  if (req.query.includeInactive !== "true") {
    filter.isActive = true;
  }

  const sort = req.query.popular === "true" ? { usageCount: -1, name: 1 } : { name: 1 };

  const [categories, total] = await Promise.all([
    Category.find(filter).sort(sort).skip(skip).limit(limit),
    Category.countDocuments(filter)
  ]);

  return sendSuccess(res, 200, "Categories fetched successfully.", {
    categories,
    pagination: buildPagination({ page, limit, total })
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, deletedAt: null });

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  if (req.body.name !== undefined) {
    category.name = req.body.name;
    category.slug = slugify(req.body.name);
  }
  if (req.body.icon !== undefined) category.icon = req.body.icon;
  if (req.body.description !== undefined) category.description = req.body.description;
  if (req.body.isActive !== undefined) category.isActive = req.body.isActive;

  await category.save();

  await auditLog({
    req,
    action: "category.updated",
    entityType: "Category",
    entityId: category._id
  });

  return sendSuccess(res, 200, "Category updated successfully.", {
    category
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, deletedAt: null });

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  category.isActive = false;
  category.deletedAt = new Date();
  await category.save();

  await auditLog({
    req,
    action: "category.deleted",
    entityType: "Category",
    entityId: category._id
  });

  return sendSuccess(res, 200, "Category deleted successfully.", {
    category
  });
});

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
};
