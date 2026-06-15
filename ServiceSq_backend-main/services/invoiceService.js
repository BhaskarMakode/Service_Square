const crypto = require("crypto");

const roundMoney = (value) => Number((Number(value || 0)).toFixed(2));

const mapPaymentStatus = ({ booking, payment }) => {
  if (payment) {
    if (payment.paymentStatus === "succeeded") return "paid";
    if (payment.paymentStatus === "pending") return "pending";
    if (payment.paymentStatus === "failed") return "failed";
    if (payment.paymentStatus === "refunded") return "refunded";
  }

  if (booking.paymentStatus === "paid") return "paid";
  if (booking.paymentStatus === "pending") return "pending";
  if (booking.paymentStatus === "failed") return "failed";

  return "unpaid";
};

const generateInvoiceNumber = () => {
  const date = new Date();
  const stamp = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `LC-INV-${stamp}-${suffix}`;
};

const buildInvoiceTotals = (amount) => {
  const taxRate = Number(process.env.INVOICE_TAX_RATE || 0);
  const platformFeeRate = Number(process.env.INVOICE_PLATFORM_FEE_RATE || 0);
  const baseAmount = roundMoney(amount);
  const taxes = roundMoney(baseAmount * taxRate);
  const platformFee = roundMoney(baseAmount * platformFeeRate);
  const totalAmount = roundMoney(baseAmount + taxes + platformFee);

  return {
    amount: baseAmount,
    taxes,
    platformFee,
    totalAmount
  };
};

module.exports = {
  buildInvoiceTotals,
  generateInvoiceNumber,
  mapPaymentStatus,
  roundMoney
};
