const AppError = require("../utils/AppError");

const sendSms = async ({ phone, message, metadata = {} }) => {
  const provider = process.env.SMS_PROVIDER || "console";

  if (provider === "console") {
    if (process.env.NODE_ENV === "production") {
      throw new AppError("SMS provider is not configured.", 503);
    }

    // Development-only OTP delivery: replace this branch with Twilio/Fast2SMS/etc.
    console.info(`[SMS:console] To ${phone}: ${message}`, metadata);
    return {
      provider,
      delivered: true
    };
  }

  throw new AppError(`Unsupported SMS provider: ${provider}.`, 503);
};

module.exports = {
  sendSms
};
