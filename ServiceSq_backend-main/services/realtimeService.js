const publishEvent = async (eventName, payload = {}) => {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[realtime:no-op] ${eventName}`, payload);
  }

  return {
    delivered: false,
    adapter: "noop"
  };
};

module.exports = {
  publishEvent
};
