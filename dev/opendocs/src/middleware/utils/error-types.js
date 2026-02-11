/**
 * Typed error classes for OpenDocs API
 * Provides structured error handling with recovery strategies
 */
export class OpenDocsError extends Error {
    statusCode;
    retryable;
    retryAfterMs;
    context;
    constructor(message, statusCode, retryable = false, retryAfterMs, context) {
        super(message);
        this.name = 'OpenDocsError';
        this.statusCode = statusCode;
        this.retryable = retryable;
        this.retryAfterMs = retryAfterMs;
        this.context = context;
        Object.setPrototypeOf(this, OpenDocsError.prototype);
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            retryable: this.retryable,
            retryAfterMs: this.retryAfterMs,
            ...(this.context && { context: this.context })
        };
    }
}
/**
 * Cache-related errors (500 Server Error - Retryable)
 */
export class CacheError extends OpenDocsError {
    constructor(message, context) {
        super(message, 500, true, // retryable
        1000, // retry after 1s
        context);
        this.name = 'CacheError';
        Object.setPrototypeOf(this, CacheError.prototype);
    }
}
/**
 * Rate limit exceeded (429 Too Many Requests - Retryable with backoff)
 */
export class RateLimitError extends OpenDocsError {
    constructor(message, retryAfterMs = 60000, context) {
        super(message, 429, true, // retryable
        retryAfterMs, context);
        this.name = 'RateLimitError';
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
/**
 * Validation error (400 Bad Request - Not retryable)
 */
export class ValidationError extends OpenDocsError {
    constructor(message, context) {
        super(message, 400, false, // not retryable
        undefined, context);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
/**
 * Authentication/Authorization error (401/403 - Not retryable)
 */
export class AuthError extends OpenDocsError {
    constructor(message, statusCode = 401, context) {
        super(message, statusCode, false, // not retryable
        undefined, context);
        this.name = 'AuthError';
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}
/**
 * Resource not found error (404 - Not retryable)
 */
export class NotFoundError extends OpenDocsError {
    constructor(message, context) {
        super(message, 404, false, // not retryable
        undefined, context);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
/**
 * Timeout error (504 Gateway Timeout - Retryable)
 */
export class TimeoutError extends OpenDocsError {
    timeoutMs;
    constructor(message, timeoutMs, context) {
        super(message, 504, true, // retryable
        2000, // retry after 2s
        context);
        this.name = 'TimeoutError';
        this.timeoutMs = timeoutMs;
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}
/**
 * Service unavailable error (503 - Retryable with exponential backoff)
 */
export class ServiceUnavailableError extends OpenDocsError {
    constructor(message, retryAfterMs = 5000, context) {
        super(message, 503, true, // retryable
        retryAfterMs, context);
        this.name = 'ServiceUnavailableError';
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}
/**
 * Database error (500 - Retryable)
 */
export class DatabaseError extends OpenDocsError {
    constructor(message, context) {
        super(message, 500, true, // retryable
        1000, // retry after 1s
        context);
        this.name = 'DatabaseError';
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}
/**
 * External API error (500/503 - Retryable)
 */
export class ExternalAPIError extends OpenDocsError {
    externalService;
    constructor(message, externalService, statusCode = 500, context) {
        super(message, statusCode, true, // retryable
        2000, // retry after 2s
        { externalService, ...context });
        this.name = 'ExternalAPIError';
        this.externalService = externalService;
        Object.setPrototypeOf(this, ExternalAPIError.prototype);
    }
}
/**
 * Type guard: Check if error is an OpenDocsError
 */
export function isOpenDocsError(error) {
    return error instanceof OpenDocsError;
}
/**
 * Exponential backoff calculator for retries
 * @param attempt - Current attempt number (0-indexed)
 * @param baseMs - Base delay in milliseconds (default 1000)
 * @param maxMs - Maximum delay in milliseconds (default 60000)
 * @returns Delay in milliseconds with jitter
 */
export function calculateBackoffDelay(attempt, baseMs = 1000, maxMs = 60000) {
    // exponential: 2^attempt * baseMs, capped at maxMs
    const exponentialDelay = Math.min(Math.pow(2, attempt) * baseMs, maxMs);
    // add random jitter (±10%)
    const jitter = exponentialDelay * (0.9 + Math.random() * 0.2);
    return Math.round(jitter);
}
/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG = {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 60000,
    shouldRetry: (error, attempt) => {
        // Retry if error is retryable and we haven't exceeded max attempts
        return error.retryable && attempt < 3;
    }
};
/**
 * Execute function with exponential backoff retry
 */
export async function withRetry(fn, config = {}) {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError;
    for (let attempt = 0; attempt < finalConfig.maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            if (!isOpenDocsError(error)) {
                throw error; // Non-OpenDocsError, don't retry
            }
            lastError = error;
            // Check if we should retry this error
            if (!finalConfig.shouldRetry(error, attempt)) {
                throw error;
            }
            // Don't sleep on last attempt
            if (attempt < finalConfig.maxAttempts - 1) {
                const delayMs = calculateBackoffDelay(attempt, finalConfig.baseDelayMs, finalConfig.maxDelayMs);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }
    // All retries exhausted
    throw lastError || new OpenDocsError('Unknown error after retries', 500, false);
}
