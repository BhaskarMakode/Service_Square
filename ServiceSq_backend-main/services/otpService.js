const bcrypt = require("bcryptjs");
const { randomInt } = require("crypto");

const generateOtp = () => {
  return String(randomInt(100000, 1000000));
};

const hashOtp = async (otp) => {
  return bcrypt.hash(otp, 10);
};

const compareOtp = async (otp, hash) => {
  return bcrypt.compare(otp, hash);
};

const getOtpExpiry = () => {
  const expiresInMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 5);
  return new Date(Date.now() + expiresInMinutes * 60 * 1000);
};

module.exports = {
  generateOtp,
  hashOtp,
  compareOtp,
  getOtpExpiry
};
