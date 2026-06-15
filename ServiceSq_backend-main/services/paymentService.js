const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

const getCommission = (amount) => {
  const rate = Number(process.env.PLATFORM_COMMISSION_RATE || 0.15);
  const commissionAmount = Number((amount * rate).toFixed(2));
  const providerEarning = Number((amount - commissionAmount).toFixed(2));

  return {
    commissionAmount,
    providerEarning
  };
};

const createPaymentIntent = async ({ amount, currency }) => {
  const paymentIntentId = `mock_pi_${crypto.randomBytes(12).toString("hex")}`;
  const clientSecret = `mock_secret_${crypto.randomBytes(24).toString("hex")}`;
  const clientSecretHash = await bcrypt.hash(clientSecret, 10);

  return {
    paymentIntentId,
    clientSecret,
    clientSecretHash,
    amount,
    currency
  };
};

const verifyPaymentIntent = async ({ payment, clientSecret, transactionId, signature }) => {
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;

    if (!secret) {
      throw new AppError("Payment verification secret is not configured.", 503);
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${payment.paymentIntentId}:${transactionId}:${payment.amount}`)
      .digest("hex");

    if (!signature || signature !== expected) {
      throw new AppError("Invalid payment signature.", 400);
    }

    return true;
  }

  const matches = await bcrypt.compare(clientSecret || "", payment.clientSecretHash);

  if (!matches) {
    throw new AppError("Invalid mock payment client secret.", 400);
  }

  return true;
};

module.exports = {
  createPaymentIntent,
  getCommission,
  verifyPaymentIntent
};
