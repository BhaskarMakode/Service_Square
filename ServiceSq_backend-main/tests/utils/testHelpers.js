/**
 * Test Helper Utilities
 * Shared utilities for backend testing, including mock Redis, environment validation, and route collection
 */

const Redis = require('ioredis');

/**
 * Mock Redis Client for Testing
 * Simulates Redis functionality without requiring a running Redis server
 */
class MockRedisClient {
  constructor() {
    this.store = new Map();
    this.connected = true;
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async set(key, value, ...args) {
    this.store.set(key, value);
    return 'OK';
  }

  async del(...keys) {
    let count = 0;
    keys.forEach(key => {
      if (this.store.has(key)) {
        this.store.delete(key);
        count++;
      }
    });
    return count;
  }

  async exists(...keys) {
    let count = 0;
    keys.forEach(key => {
      if (this.store.has(key)) count++;
    });
    return count;
  }

  async setex(key, seconds, value) {
    this.store.set(key, value);
    setTimeout(() => this.store.delete(key), seconds * 1000);
    return 'OK';
  }

  async lpush(key, ...values) {
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }
    const list = this.store.get(key);
    list.unshift(...values);
    return list.length;
  }

  async rpop(key) {
    if (!this.store.has(key)) return null;
    const list = this.store.get(key);
    return list.pop();
  }

  async llen(key) {
    if (!this.store.has(key)) return 0;
    return this.store.get(key).length;
  }

  async lrange(key, start, stop) {
    if (!this.store.has(key)) return [];
    const list = this.store.get(key);
    return list.slice(start, stop + 1);
  }

  async quit() {
    this.store.clear();
    this.connected = false;
    return 'OK';
  }

  async ping() {
    return 'PONG';
  }

  on(event, handler) {
    // Mock event handler
    return this;
  }

  once(event, handler) {
    // Mock once event handler
    return this;
  }

  disconnect() {
    this.connected = false;
  }
}

/**
 * Validate required environment variables
 * @param {string[]} requiredVars - Array of required environment variable names
 * @returns {Object} { valid: boolean, missing: string[] }
 */
function validateEnvironmentVariables(requiredVars) {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Collect all registered routes from Express app
 * @param {Object} app - Express application instance
 * @returns {Array} Array of route objects with path and method
 */
function collectAppRoutes(app) {
  const routes = [];

  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Direct route
      const methods = Object.keys(middleware.route.methods);
      routes.push({
        path: middleware.route.path,
        methods
      });
    } else if (middleware.name === 'router' && middleware.handle._router) {
      // Router middleware
      const prefix = middleware.regexp.source
        .replace('\\/?', '')
        .replace('(?:\\/(?=\/))?(?:\\/([^\\/]+?))*\\/?$', '')
        .replace(/\\/g, '')
        .replace(/\^/g, '')
        .replace(/\$/g, '');

      middleware.handle._router.stack.forEach(handler => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods);
          const fullPath = prefix + handler.route.path;
          routes.push({
            path: fullPath,
            methods
          });
        }
      });
    }
  });

  return routes;
}

/**
 * Verify route registration with prefix
 * @param {Array} routes - Array of collected routes
 * @param {string} prefix - Route prefix (e.g., '/api', '/api/v1')
 * @param {string[]} expectedRoutes - Expected route paths
 * @returns {Object} { registered: Array, missing: Array }
 */
function verifyRouteRegistration(routes, prefix, expectedRoutes) {
  const registered = [];
  const missing = [];

  expectedRoutes.forEach(route => {
    const found = routes.some(r => r.path === `${prefix}${route}`);
    if (found) {
      registered.push(`${prefix}${route}`);
    } else {
      missing.push(`${prefix}${route}`);
    }
  });

  return { registered, missing };
}

/**
 * Wait for async operation with timeout
 * @param {Promise} promise - Promise to wait for
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise}
 */
function waitWithTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timeout after ${ms}ms`)), ms)
    )
  ]);
}

module.exports = {
  MockRedisClient,
  validateEnvironmentVariables,
  collectAppRoutes,
  verifyRouteRegistration,
  waitWithTimeout
};
