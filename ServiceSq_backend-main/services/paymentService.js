const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');

const getCommission = (amount) => {
  const rate = Number(process.env.PLATFORM_COMMISSION_RATE || 0.23);
  const commissionAmount = Number((amount * rate).toFixed(2));
  const providerEarning = Number((amount - commissionAmount).toFixed(2));
  return { commissionAmount, providerEarning };
};

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  try {
    const Razorpay = require('razorpay');
    return new Razorpay({ key_id, key_secret });
  } catch (e) {
    return null;
  }
};

const createPaymentIntent = async ({ amount, currency }) => {
  const razorpay = getRazorpayInstance();
  const curr = (currency || process.env.PAYMENT_CURRENCY || 'INR').toUpperCase();
  
  if (razorpay && process.env.PAYMENT_PROVIDER === 'razorpay') {
    // Razorpay amount is in paise (smallest unit)
    const amountInPaise = Math.round(amount * 100);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: curr,
      receipt: `receipt_${Date.now()}`,
    });
    const clientSecretHash = await bcrypt.hash(order.id, 10);
    return {
      paymentIntentId: order.id,
      clientSecret: order.id, // For Razorpay, we return orderId as clientSecret
      clientSecretHash,
      amount,
      currency: curr,
      razorpayOrderId: order.id,
      isRazorpay: true,
    };
  }
  
  // Mock fallback
  const paymentIntentId = `mock_pi_${crypto.randomBytes(12).toString('hex')}`;
  const clientSecret = `mock_secret_${crypto.randomBytes(24).toString('hex')}`;
  const clientSecretHash = await bcrypt.hash(clientSecret, 10);
  return { paymentIntentId, clientSecret, clientSecretHash, amount, currency: curr, isRazorpay: false };
};

const verifyPaymentIntent = async ({ payment, clientSecret, transactionId, signature }) => {
  const razorpay = getRazorpayInstance();
  
  if (razorpay && process.env.PAYMENT_PROVIDER === 'razorpay' && signature) {
    // Razorpay signature verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new AppError('Razorpay secret not configured.', 503);
    const body = `${payment.paymentIntentId}|${transactionId}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (signature !== expectedSignature) {
      throw new AppError('Invalid Razorpay payment signature.', 400);
    }
    return true;
  }
  
  if (process.env.NODE_ENV === 'production' && !signature) {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!secret) throw new AppError('Payment verification secret is not configured.', 503);
    const expected = crypto.createHmac('sha256', secret).update(`${payment.paymentIntentId}:${transactionId}:${payment.amount}`).digest('hex');
    if (!signature || signature !== expected) throw new AppError('Invalid payment signature.', 400);
    return true;
  }
  
  // Mock verification
  const matches = await bcrypt.compare(clientSecret || '', payment.clientSecretHash);
  if (!matches) throw new AppError('Invalid mock payment client secret.', 400);
  return true;
};

module.exports = { createPaymentIntent, getCommission, verifyPaymentIntent, getRazorpayInstance };
