const normalizePhone = (phone) => {
  return String(phone || "").trim().replace(/\s+/g, "");
};

module.exports = normalizePhone;
