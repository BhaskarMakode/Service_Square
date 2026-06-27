export const formatCurrency = (value, options = {}) => {
  const amount = Number(value || 0);
  const digits = options.maximumFractionDigits ?? 2;

  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: digits
  })}`;
};

export const formatRate = (value) => `${formatCurrency(value)}/hr`;
