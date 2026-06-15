const { sendError } = require("../utils/apiResponse");

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";
  let errors = error.errors || [];

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  if (error.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(error.keyValue || {});
    message = fields.length ? `${fields.join(", ")} already exists.` : "Duplicate resource.";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));
  }

  if (error.name === "MulterError") {
    statusCode = 400;
    message = error.message || "File upload failed.";
  }

  if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
    console.error(error);
  }

  return sendError(res, statusCode, message, errors);
};

module.exports = {
  notFound,
  errorHandler
};
