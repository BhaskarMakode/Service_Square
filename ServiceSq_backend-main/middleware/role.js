const AppError = require("../utils/AppError");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("You are not allowed to perform this action.", 403));
    }

    return next();
  };
};

module.exports = authorizeRoles;
