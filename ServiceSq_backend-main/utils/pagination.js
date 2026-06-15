const getPagination = (query = {}, defaults = {}) => {
  const page = Math.max(Number(query.page || defaults.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || defaults.limit || 10), 1), defaults.maxLimit || 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
};

const buildPagination = ({ page, limit, total }) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
};

module.exports = {
  getPagination,
  buildPagination
};
