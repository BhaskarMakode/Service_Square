const crypto = require("crypto");
const RefreshToken = require("../models/RefreshToken");
const generateToken = require("../utils/generateToken");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const createRefreshTokenValue = () => {
  return crypto.randomBytes(48).toString("hex");
};

const getRefreshTokenExpiry = () => {
  const days = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 30);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

const issueAuthTokens = async (user, req) => {
  const accessToken = generateToken(user);
  const refreshToken = createRefreshTokenValue();
  const tokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: getRefreshTokenExpiry(),
    ip: req && req.ip,
    userAgent: req && req.get && req.get("user-agent")
  });

  return {
    token: accessToken,
    refreshToken
  };
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 30) * 24 * 60 * 60 * 1000
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
};

module.exports = {
  clearRefreshTokenCookie,
  hashToken,
  issueAuthTokens,
  setRefreshTokenCookie
};
