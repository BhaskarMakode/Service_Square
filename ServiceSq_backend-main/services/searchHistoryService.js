const SearchHistory = require("../models/SearchHistory");

const getSearchHistoryLimit = () => Number(process.env.SEARCH_HISTORY_LIMIT || 20);

const normalizeKeyword = (keyword) => String(keyword || "").trim().slice(0, 100);

const trimOldSearches = async (userId, limit = getSearchHistoryLimit()) => {
  const extra = await SearchHistory.find({ userId })
    .sort({ searchedAt: -1 })
    .skip(limit)
    .select("_id");

  if (extra.length > 0) {
    await SearchHistory.deleteMany({ _id: { $in: extra.map((item) => item._id) } });
  }
};

const recordSearch = async ({ userId, keyword }) => {
  const normalizedKeyword = normalizeKeyword(keyword);

  if (!userId || !normalizedKeyword) {
    return null;
  }

  const history = await SearchHistory.findOneAndUpdate(
    {
      userId,
      keyword: normalizedKeyword
    },
    {
      $set: {
        searchedAt: new Date()
      },
      $setOnInsert: {
        userId,
        keyword: normalizedKeyword
      }
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  await trimOldSearches(userId);

  return history;
};

module.exports = {
  getSearchHistoryLimit,
  normalizeKeyword,
  recordSearch,
  trimOldSearches
};
