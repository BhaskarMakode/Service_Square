const { ipKeyGenerator, rateLimit } = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req, res) => process.env.NODE_ENV === "development",
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: []
  }
});

const otpLimiter = rateLimit({
  windowMs: Number(process.env.OTP_RESEND_SECONDS || 60) * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.body.phone || ipKeyGenerator(req.ip),
  message: {
    success: false,
    message: "Too many OTP requests. Please wait before trying again.",
    errors: []
  }
});

module.exports = {
  apiLimiter,
  otpLimiter
};
