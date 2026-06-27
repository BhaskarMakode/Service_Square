const Otp = require("../models/Otp");
const ProviderProfile = require("../models/ProviderProfile");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const normalizePhone = require("../utils/normalizePhone");
const { sendSms } = require("../services/smsService");
const { compareOtp, generateOtp, getOtpExpiry, hashOtp } = require("../services/otpService");
const {
  clearRefreshTokenCookie,
  hashToken,
  issueAuthTokens,
  setRefreshTokenCookie
} = require("../services/tokenService");

const sendOtp = asyncHandler(async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const adminPhone = normalizePhone(process.env.ADMIN_PHONE);

  if (!req.isSuperAdminLogin && adminPhone && phone === adminPhone) {
    throw new AppError("Please use the Super Admin login option for this account.", 403);
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = getOtpExpiry();
  const expiresInMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 5);

  await Otp.deleteMany({ phone, consumedAt: null });

  await Otp.create({
    phone,
    otpHash,
    expiresAt
  });

  await sendSms({
    phone,
    message: `Your LocalConnect OTP is ${otp}. It expires in ${expiresInMinutes} minutes.`,
    metadata: {
      purpose: "login"
    }
  });

  const data = {
    phone,
    expiresAt,
    expiresInSeconds: expiresInMinutes * 60
  };

  if (process.env.NODE_ENV !== "production") {
    data.devOtp = otp;
  }

  return sendSuccess(res, 200, "OTP sent successfully.", data);
});

const ensureConfiguredAdminAccount = async ({ phone, email }) => {
  return User.findOneAndUpdate(
    { phone },
    {
      name: process.env.ADMIN_NAME || "Service Square Super Admin",
      email,
      phone,
      role: "admin",
      isVerified: true,
      isActive: true,
      deletedAt: null
    },
    { new: true, upsert: true, runValidators: true }
  );
};

const sendSuperAdminOtp = asyncHandler(async (req, res, next) => {
  const configuredPhone = normalizePhone(process.env.ADMIN_PHONE);
  const configuredEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const requestedPhone = normalizePhone(req.body.phone);
  const requestedEmail = String(req.body.email || "").trim().toLowerCase();

  if (!configuredPhone || !configuredEmail) {
    throw new AppError("Super admin login is not configured.", 503);
  }

  if (requestedPhone !== configuredPhone || requestedEmail !== configuredEmail) {
    throw new AppError("Super admin credentials do not match the configured account.", 403);
  }

  await ensureConfiguredAdminAccount({
    phone: configuredPhone,
    email: configuredEmail
  });

  req.body.phone = requestedPhone;
  req.isSuperAdminLogin = true;
  return sendOtp(req, res, next);
});

const verifyOtp = asyncHandler(async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const otp = String(req.body.otp || "").trim();
  const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5);

  const otpRecord = await Otp.findOne({
    phone,
    consumedAt: null
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new AppError("OTP not found. Please request a new OTP.", 400);
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new AppError("OTP has expired. Please request a new OTP.", 400);
  }

  if (otpRecord.attempts >= maxAttempts) {
    throw new AppError("Maximum OTP attempts exceeded. Please request a new OTP.", 429);
  }

  const isValidOtp = await compareOtp(otp, otpRecord.otpHash);

  if (!isValidOtp) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new AppError("Invalid OTP.", 400);
  }

  otpRecord.consumedAt = new Date();
  await otpRecord.save();

  let user = await User.findOne({ phone });

  const adminPhone = normalizePhone(process.env.ADMIN_PHONE);
  const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();

  if (!user) {
    if (adminPhone && phone === adminPhone) {
      throw new AppError("Super admin account is not configured correctly.", 403);
    }

    user = await User.create({
      phone,
      role: "customer",
      isVerified: true
    });
  } else {
    if (!user.isActive || user.deletedAt) {
      throw new AppError("This account is inactive.", 403);
    }

    user.isVerified = true;

    if (adminPhone && phone === adminPhone) {
      if (user.role !== "admin" || String(user.email || "").toLowerCase() !== adminEmail) {
        throw new AppError("Super admin account does not match the configured ADMIN details.", 403);
      }
    }

    await user.save();
  }

  const tokens = await issueAuthTokens(user, req);
  setRefreshTokenCookie(res, tokens.refreshToken);

  return sendSuccess(res, 200, "OTP verified successfully.", {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user: user.toSafeObject(),
    requiresRegistration: !user.name
  });
});

const register = asyncHandler(async (req, res) => {
  const { name, role, email, avatar } = req.body;
  const requestedPhone = req.body.phone ? normalizePhone(req.body.phone) : undefined;

  if (requestedPhone && requestedPhone !== req.user.phone) {
    throw new AppError("Registration phone must match the verified phone number.", 400);
  }

  req.user.name = name;
  req.user.role = role;
  req.user.email = email || undefined;
  req.user.avatar = avatar || undefined;
  req.user.isVerified = true;

  await req.user.save();

  const tokens = await issueAuthTokens(req.user, req);
  setRefreshTokenCookie(res, tokens.refreshToken);

  return sendSuccess(res, 200, "Registration completed successfully.", {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user: req.user.toSafeObject()
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const data = {
    user: req.user.toSafeObject()
  };

  if (req.user.role === "provider") {
    data.providerProfile = await ProviderProfile.findOne({ userId: req.user._id });
  }

  return sendSuccess(res, 200, "Profile fetched successfully.", data);
});

const refreshToken = asyncHandler(async (req, res) => {
  const providedRefreshToken = req.body.refreshToken || (req.cookies && req.cookies.refreshToken);

  if (!providedRefreshToken) {
    throw new AppError("Refresh token is required.", 401);
  }

  const tokenHash = hashToken(providedRefreshToken);
  const tokenRecord = await RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() }
  }).populate("userId");

  if (!tokenRecord || !tokenRecord.userId) {
    throw new AppError("Invalid or expired refresh token.", 401);
  }

  const user = tokenRecord.userId;

  if (!user.isActive || user.deletedAt || !user.isVerified) {
    throw new AppError("This account cannot be refreshed.", 403);
  }

  const tokens = await issueAuthTokens(user, req);
  tokenRecord.revokedAt = new Date();
  tokenRecord.replacedByTokenHash = hashToken(tokens.refreshToken);
  await tokenRecord.save();

  setRefreshTokenCookie(res, tokens.refreshToken);

  return sendSuccess(res, 200, "Token refreshed successfully.", {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user: user.toSafeObject()
  });
});

const logout = asyncHandler(async (req, res) => {
  const providedRefreshToken = req.body.refreshToken || (req.cookies && req.cookies.refreshToken);

  if (providedRefreshToken) {
    await RefreshToken.findOneAndUpdate(
      {
        tokenHash: hashToken(providedRefreshToken),
        revokedAt: null
      },
      {
        revokedAt: new Date()
      }
    );
  }

  clearRefreshTokenCookie(res);

  return sendSuccess(res, 200, "Logged out successfully.");
});

module.exports = {
  sendOtp,
  sendSuperAdminOtp,
  verifyOtp,
  register,
  getProfile,
  refreshToken,
  logout
};
