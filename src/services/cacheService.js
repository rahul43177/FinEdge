const logger = require("../middleware/logger");

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlMs) {
    const expiry = Date.now() + ttlMs;

    this.cache.set(key, {
      value,
      expiry
    });

    logger.debug(`Cache SET | key=${key} | ttl=${ttlMs}ms`);
  }

  get(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      logger.debug(`Cache MISS | key=${key}`);
      return null;
    }

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      logger.debug(`Cache EXPIRED | key=${key}`);
      return null;
    }

    logger.debug(`Cache HIT | key=${key}`);
    return cached.value;
  }

  delete(key) {
    this.cache.delete(key);
    logger.debug(`Cache DELETE | key=${key}`);
  }

  clear() {
    this.cache.clear();
    logger.debug("Cache CLEARED");
  }
}

module.exports = new CacheService();
