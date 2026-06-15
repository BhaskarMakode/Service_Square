let redisClient;

const getRedisClient = () => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    const Redis = require("ioredis");
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: true
    });

    redisClient.on("error", (error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Redis error:", error.message);
      }
    });
  }

  return redisClient;
};

const getCache = async (key) => {
  const client = getRedisClient();
  if (!client) return null;

  if (client.status === "wait") {
    await client.connect();
  }

  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
};

const setCache = async (key, value, ttlSeconds = 300) => {
  const client = getRedisClient();
  if (!client) return false;

  if (client.status === "wait") {
    await client.connect();
  }

  await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  return true;
};

const deleteCache = async (key) => {
  const client = getRedisClient();
  if (!client) return false;

  if (client.status === "wait") {
    await client.connect();
  }

  await client.del(key);
  return true;
};

module.exports = {
  getCache,
  setCache,
  deleteCache
};
