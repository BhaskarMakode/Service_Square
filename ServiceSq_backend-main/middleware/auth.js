const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Authentication token is required.", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired authentication token.", 401);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("The authenticated user no longer exists.", 401);
  }

  if (!user.isActive || user.deletedAt) {
    throw new AppError("This account is inactive.", 403);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your mobile number before continuing.", 403);
  }

  req.user = user;
  next();
});

module.exports = protect;
