const ProviderProfile = require("../models/ProviderProfile");
const Subscription = require("../models/Subscription");
const AppError = require("../utils/AppError");
const auditLog = require("../utils/auditLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const {
  addDays,
  createMockSubscriptionReference,
  getPlanByName,
  getPlans,
  isSubscriptionActive
} = require("../services/subscriptionService");

const getCurrentProvider = async (userId) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  return provider;
};

const getSubscriptionPlans = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, "Subscription plans fetched successfully.", {
    plans: getPlans()
  });
});

const upgradeSubscription = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  const plan = getPlanByName(req.body.planName);

  if (!plan) {
    throw new AppError("Subscription plan not found.", 404);
  }

  const startDate = new Date();
  const expiryDate = addDays(startDate, plan.durationDays);

  await Subscription.updateMany(
    {
      providerId: provider._id,
      paymentStatus: "paid",
      expiryDate: { $gte: startDate }
    },
    {
      paymentStatus: "expired",
      expiryDate: startDate
    }
  );

  const subscription = await Subscription.create({
    providerId: provider._id,
    planName: plan.planName,
    amount: plan.amount,
    currency: process.env.PAYMENT_CURRENCY || "INR",
    startDate,
    expiryDate,
    paymentStatus: "paid",
    features: plan.features,
    paymentMethod: req.body.paymentMethod || "mock",
    paymentReference: createMockSubscriptionReference()
  });

  provider.isPremium = true;
  provider.premiumUntil = expiryDate;
  await provider.save();

  await auditLog({
    req,
    action: "subscription.upgraded",
    entityType: "Subscription",
    entityId: subscription._id,
    metadata: {
      providerId: provider._id,
      planName: plan.planName
    }
  });

  return sendSuccess(res, 201, "Subscription upgraded successfully.", {
    subscription,
    premiumBadge: true
  });
});

const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const provider = await getCurrentProvider(req.user._id);
  const subscription = await Subscription.findOne({ providerId: provider._id }).sort({ createdAt: -1 });
  const active = isSubscriptionActive(subscription);

  if (subscription && subscription.paymentStatus === "paid" && !active) {
    subscription.paymentStatus = "expired";
    await subscription.save();
  }

  if (provider.isPremium !== active) {
    provider.isPremium = active;
    provider.premiumUntil = active && subscription ? subscription.expiryDate : null;
    await provider.save();
  }

  return sendSuccess(res, 200, "Subscription status fetched successfully.", {
    active,
    premiumBadge: active,
    providerId: provider._id,
    subscription
  });
});

module.exports = {
  getSubscriptionPlans,
  getSubscriptionStatus,
  upgradeSubscription
};
