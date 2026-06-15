const crypto = require("crypto");

const plans = [
  {
    planName: "premium_monthly",
    displayName: "Premium Monthly",
    amount: 499,
    durationDays: 30,
    features: ["premium_badge", "priority_listing", "portfolio_boost", "analytics_access"]
  },
  {
    planName: "premium_quarterly",
    displayName: "Premium Quarterly",
    amount: 1299,
    durationDays: 90,
    features: ["premium_badge", "priority_listing", "portfolio_boost", "analytics_access"]
  },
  {
    planName: "premium_yearly",
    displayName: "Premium Yearly",
    amount: 4499,
    durationDays: 365,
    features: ["premium_badge", "priority_listing", "portfolio_boost", "analytics_access", "reduced_commission_ready"]
  }
];

const getPlans = () => plans.map((plan) => ({ ...plan }));

const getPlanByName = (planName) => {
  const normalized = String(planName || "").trim().toLowerCase();
  return plans.find((plan) => plan.planName === normalized);
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const createMockSubscriptionReference = () => {
  return `mock_sub_${crypto.randomBytes(12).toString("hex")}`;
};

const isSubscriptionActive = (subscription, now = new Date()) => {
  return Boolean(
    subscription &&
      subscription.paymentStatus === "paid" &&
      subscription.expiryDate &&
      subscription.expiryDate > now
  );
};

module.exports = {
  addDays,
  createMockSubscriptionReference,
  getPlanByName,
  getPlans,
  isSubscriptionActive
};
