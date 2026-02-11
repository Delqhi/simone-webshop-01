/**
 * Typed error classes for OpenDocs API
 * Provides structured error handling with recovery strategies
 */
export declare class OpenDocsError extends Error {
    readonly statusCode: number;
    readonly retryable: boolean;
    readonly retryAfterMs?: number;
    readonly context?: Record<string, unknown>;
    constructor(message: string, statusCode: number, retryable?: boolean, retryAfterMs?: number, context?: Record<string, unknown>);
    toJSON(): {
        context: Record<string, unknown>;
        name: string;
        message: string;
        statusCode: number;
        retryable: boolean;
        retryAfterMs: number;
    };
}
/**
 * Cache-related errors (500 Server Error - Retryable)
 */
export declare class CacheError extends OpenDocsError {
    constructor(message: string, context?: Record<string, unknown>);
}
/**
 * Rate limit exceeded (429 Too Many Requests - Retryable with backoff)
 */
export declare class RateLimitError extends OpenDocsError {
    constructor(message: string, retryAfterMs?: number, context?: Record<string, unknown>);
}
/**
 * Validation error (400 Bad Request - Not retryable)
 */
export declare class ValidationError extends OpenDocsError {
    constructor(message: string, context?: Record<string, unknown>);
}
/**
 * Authentication/Authorization error (401/403 - Not retryable)
 */
export declare class AuthError extends OpenDocsError {
    constructor(message: string, statusCode?: number, context?: Record<string, unknown>);
}
/**
 * Resource not found error (404 - Not retryable)
 */
export declare class NotFoundError extends OpenDocsError {
    constructor(message: string, context?: Record<string, unknown>);
}
/**
 * Timeout error (504 Gateway Timeout - Retryable)
 */
export declare class TimeoutError extends OpenDocsError {
    readonly timeoutMs: number;
    constructor(message: string, timeoutMs: number, context?: Record<string, unknown>);
}
/**
 * Service unavailable error (503 - Retryable with exponential backoff)
 */
export declare class ServiceUnavailableError extends OpenDocsError {
    constructor(message: string, retryAfterMs?: number, context?: Record<string, unknown>);
}
/**
 * Database error (500 - Retryable)
 */
export declare class DatabaseError extends OpenDocsError {
    constructor(message: string, context?: Record<string, unknown>);
}
/**
 * External API error (500/503 - Retryable)
 */
export declare class ExternalAPIError extends OpenDocsError {
    readonly externalService: string;
    constructor(message: string, externalService: string, statusCode?: number, context?: Record<string, unknown>);
}
/**
 * Type guard: Check if error is an OpenDocsError
 */
export declare function isOpenDocsError(error: unknown): error is OpenDocsError;
/**
 * Exponential backoff calculator for retries
 * @param attempt - Current attempt number (0-indexed)
 * @param baseMs - Base delay in milliseconds (default 1000)
 * @param maxMs - Maximum delay in milliseconds (default 60000)
 * @returns Delay in milliseconds with jitter
 */
export declare function calculateBackoffDelay(attempt: number, baseMs?: number, maxMs?: number): number;
/**
 * Retry configuration
 */
export interface RetryConfig {
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
    shouldRetry: (error: OpenDocsError, attempt: number) => boolean;
}
/**
 * Default retry configuration
 */
export declare const DEFAULT_RETRY_CONFIG: RetryConfig;
/**
 * Execute function with exponential backoff retry
 */
export declare function withRetry<T>(fn: () => Promise<T>, config?: Partial<RetryConfig>): Promise<T>;
