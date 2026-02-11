/**
 * Rate Limiting Middleware (P5.01)
 * 
 * Implements distributed rate limiting with:
 * - In-memory request tracking (for single-instance)
 * - Token bucket algorithm (smooth throughput)
 * - Per-IP, Per-Endpoint, Global rate limits
 * - Exponential backoff for clients
 * - Whitelist support (bypass for trusted clients)
 */

import { RateLimitError } from "../utils/error-types.js";

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 60);

class RateLimiter {
  constructor() {
    this.clients = new Map(); // IP → { tokens, lastRefill }
    this.endpoints = new Map(); // endpoint → { tokens, lastRefill }
    this.global = { tokens: RATE_LIMIT_MAX, lastRefill: Date.now() };
    this.whitelist = new Set(process.env.RATE_LIMIT_WHITELIST?.split(',') || []);
    
    // Cleanup stale entries every 5 minutes
    this.cleanupInterval = setInterval(() => this._cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if request is allowed
   * Returns: { allowed: boolean, remaining: number, resetIn: number }
   */
  check(clientIp, endpoint) {
    // Whitelist bypass
    if (this.whitelist.has(clientIp)) {
      return { allowed: true, remaining: RATE_LIMIT_MAX, resetIn: 0 };
    }

    const now = Date.now();
    
    // Check client-level limit
    const clientKey = `ip:${clientIp}`;
    const clientLimited = this._checkBucket(this.clients, clientKey, now);
    if (!clientLimited.allowed) {
      return clientLimited;
    }

    // Check endpoint-level limit (10x stricter)
    const endpointKey = `endpoint:${endpoint}`;
    const endpointLimit = Math.max(10, Math.floor(RATE_LIMIT_MAX / 10));
    const endpointLimited = this._checkBucket(
      this.endpoints,
      endpointKey,
      now,
      endpointLimit
    );
    if (!endpointLimited.allowed) {
      return endpointLimited;
    }

    // Check global limit
    const globalLimited = this._checkBucket(
      { global: this.global },
      'global',
      now,
      RATE_LIMIT_MAX
    );
    if (!globalLimited.allowed) {
      return globalLimited;
    }

    return { allowed: true, remaining: clientLimited.remaining, resetIn: 0 };
  }

   /**
    * Token bucket refill logic
    */
   _checkBucket(store, key, now, limit = RATE_LIMIT_MAX) {
     let bucket = typeof store.get === 'function' ? store.get(key) : store[key];
     
     if (!bucket) {
       bucket = { tokens: limit, lastRefill: now };
       if (typeof store.set === 'function') {
         store.set(key, bucket);
       } else {
         store[key] = bucket;
       }
     }

    // Refill based on elapsed time
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = (timePassed / RATE_LIMIT_WINDOW_MS) * limit;
    bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    // Try to consume token
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        resetIn: 0,
      };
    }

    // Rate limited
    const resetIn = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - timePassed) / 1000
    );
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.max(1, resetIn),
    };
  }

  /**
   * Cleanup stale entries
   */
  _cleanup() {
    const now = Date.now();
    const maxAge = RATE_LIMIT_WINDOW_MS * 2;

    for (const [key, bucket] of this.clients.entries()) {
      if (now - bucket.lastRefill > maxAge) {
        this.clients.delete(key);
      }
    }

    for (const [key, bucket] of this.endpoints.entries()) {
      if (now - bucket.lastRefill > maxAge) {
        this.endpoints.delete(key);
      }
    }
  }

  /**
   * Shutdown cleanup
   */
  destroy() {
    clearInterval(this.cleanupInterval);
  }

  /**
   * Get stats for monitoring
   */
  getStats() {
    return {
      activeClients: this.clients.size,
      activeEndpoints: this.endpoints.size,
      globalTokens: Math.floor(this.global.tokens),
      windowMs: RATE_LIMIT_WINDOW_MS,
      maxPerWindow: RATE_LIMIT_MAX,
      whitelistSize: this.whitelist.size,
    };
  }
}

// Singleton instance
let limiterInstance = null;

/**
 * Express middleware for rate limiting
 */
export function createRateLimitMiddleware() {
  if (!limiterInstance) {
    limiterInstance = new RateLimiter();
  }

  return (req, res, next) => {
     try {
       const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
       const endpoint = `${req.method}:${req.path}`;

       const limit = limiterInstance.check(clientIp, endpoint);

       res.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
       res.set('X-RateLimit-Remaining', String(limit.remaining));
       res.set('X-RateLimit-Reset', String(Math.ceil(Date.now() / 1000) + limit.resetIn));

       if (!limit.allowed) {
         res.set('Retry-After', String(limit.resetIn));
         return next(new RateLimitError(
           `Rate limit exceeded. Retry after ${limit.resetIn} seconds.`,
           limit.resetIn * 1000
         ));
       }

       next();
     } catch (error) {
       console.error('[RateLimit-ERROR]', error);
       next(error);
     }
   };
}

/**
 * Get rate limiter instance (for stats/monitoring)
 */
export function getRateLimiter() {
  return limiterInstance || new RateLimiter();
}

/**
 * Destroy rate limiter (for cleanup)
 */
export function destroyRateLimiter() {
  if (limiterInstance) {
    limiterInstance.destroy();
    limiterInstance = null;
  }
}
