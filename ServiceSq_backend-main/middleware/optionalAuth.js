const jwt = require("jsonwebtoken");
const User = require("../models/User");

const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user && user.isActive && !user.deletedAt && user.isVerified) {
      req.user = user;
    }
  } catch (error) {
    // Public file/profile routes should still work without a valid token.
  }

  return next();
};

module.exports = optionalAuth;
