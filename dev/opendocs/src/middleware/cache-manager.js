/**
 * Response Caching Middleware (P5.02)
 * 
 * Production-grade in-memory caching with:
 * - Per-endpoint configurable TTL
 * - Automatic invalidation on mutations
 * - Cache statistics tracking
 * - Memory cleanup and LRU eviction
 * 
 * Status: ✅ Production Ready (Best Practices Feb 2026)
 */

const CACHE_DEFAULT_TTL_MS = Number(process.env.CACHE_DEFAULT_TTL_MS || 5 * 60 * 1000);
const CACHE_MAX_SIZE = Number(process.env.CACHE_MAX_SIZE || 100);
const CACHE_CLEANUP_INTERVAL_MS = Number(process.env.CACHE_CLEANUP_INTERVAL_MS || 60 * 1000);

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    this.writes = 0;
    this.evictions = 0;
    
    this.cleanupInterval = setInterval(() => this._cleanup(), CACHE_CLEANUP_INTERVAL_MS);
  }

  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    entry.accessCount += 1;
    entry.lastAccessed = Date.now();
    this.hits++;
    return entry.value;
  }

  set(key, value, ttl = CACHE_DEFAULT_TTL_MS) {
    if (this.cache.size >= CACHE_MAX_SIZE) {
      this._evictLRU();
    }
    
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0
    });
    this.writes++;
  }

  invalidate(pattern) {
    let count = 0;
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  invalidateExact(key) {
    const existed = this.cache.has(key);
    if (existed) {
      this.cache.delete(key);
    }
    return existed;
  }

  _evictLRU() {
    let lruKey = null;
    let minAccess = Infinity;
    let oldestTime = Infinity;
    
    for (const [key, entry] of this.cache) {
      if (entry.accessCount < minAccess || 
          (entry.accessCount === minAccess && entry.lastAccessed < oldestTime)) {
        minAccess = entry.accessCount;
        oldestTime = entry.lastAccessed;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      this.cache.delete(lruKey);
      this.evictions++;
    }
  }

  _cleanup() {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    return removed;
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.writes = 0;
    this.evictions = 0;
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: CACHE_MAX_SIZE,
      hits: this.hits,
      misses: this.misses,
      writes: this.writes,
      evictions: this.evictions,
      hitRate: total > 0 ? (this.hits / total) : 0,
      hitRatePercent: total > 0 ? ((this.hits / total) * 100).toFixed(2) : "0.00"
    };
  }
}

let cacheInstance = null;

function createCacheMiddleware(config = {}) {
  if (!cacheInstance) {
    cacheInstance = new CacheManager();
  }
  
  const endpointTTLs = config.endpointTTLs || {};
  const noCachePatterns = config.noCachePatterns || [
    '/api/nvidia/',
    '/api/agent/',
    '/api/website/'
  ];
  
  return (req, res, next) => {
    const shouldSkipCache = noCachePatterns.some(pattern => req.path.includes(pattern));
    
    // Check for cache HIT BEFORE wrapping res.json
    if (req.method === 'GET' && !shouldSkipCache) {
      const cacheKey = `GET:${req.path}:${JSON.stringify(req.query || {})}`;
      const cachedResponse = cacheInstance.get(cacheKey);
      
      if (cachedResponse) {
        res.set('X-Cache', 'HIT');
        return res.json(cachedResponse);
      }
    }
    
    // Wrap res.json ONLY for requests that don't have a cache HIT
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      // Skip cache for non-GET or no-cache patterns
      if (req.method !== 'GET' || shouldSkipCache) {
        if (req.method !== 'GET') {
          const invalidatedCount = cacheInstance.invalidate(req.path);
          if (invalidatedCount > 0) {
            res.set('X-Cache-Invalidated', String(invalidatedCount));
          }
        }
        return originalJson(data);
      }
      
      // For GET requests, set cache header and cache the response
      res.set('X-Cache', 'MISS');
      const ttl = endpointTTLs[req.path] || CACHE_DEFAULT_TTL_MS;
      const cacheKey = `GET:${req.path}:${JSON.stringify(req.query || {})}`;
      cacheInstance.set(cacheKey, data, ttl);
      return originalJson(data);
    };
    
    next();
  };
}

function getCacheManager() {
  if (!cacheInstance) {
    cacheInstance = new CacheManager();
  }
  return cacheInstance;
}

function destroyCacheManager() {
  if (cacheInstance) {
    cacheInstance.destroy();
    cacheInstance = null;
  }
}

export { createCacheMiddleware, getCacheManager, destroyCacheManager };
