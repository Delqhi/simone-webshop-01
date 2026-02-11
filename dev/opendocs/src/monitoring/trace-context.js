/**
 * Distributed Trace Context Manager
 * Phase 5.05: Trace ID propagation and context management
 * Best Practices February 2026 Compliant
 */

import { AsyncLocalStorage } from 'async_hooks';
import { nanoid } from 'nanoid';

const traceContext = new AsyncLocalStorage();

/**
 * Initialize trace context with trace ID
 * Supports W3C Trace Context (traceparent) and baggage headers
 */
export function initTraceContext(req, traceId = null) {
  const id = traceId || req.headers['traceparent']?.split('-')[1] || nanoid();
  const parentId = req.headers['x-parent-trace-id'] || null;
  const baggage = parseBaggage(req.headers['baggage']);

  const context = {
    traceId: id,
    parentTraceId: parentId,
    spanId: nanoid(),
    baggage,
    startTime: Date.now(),
    requestId: req.headers['x-request-id'] || nanoid(),
    metadata: {
      method: req.method,
      path: req.path,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || 'unknown'
    }
  };

  return context;
}

/**
 * Get current trace context
 */
export function getTraceContext() {
  return traceContext.getStore();
}

/**
 * Get trace ID from current context
 */
export function getTraceId() {
  return traceContext.getStore()?.traceId;
}

/**
 * Run function within trace context
 */
export function runWithTraceContext(context, fn) {
  return traceContext.run(context, fn);
}

/**
 * Parse W3C baggage header
 * Format: key1=value1;metadata, key2=value2
 */
function parseBaggage(baggageHeader) {
  if (!baggageHeader) return {};

  const baggage = {};
  const items = baggageHeader.split(',');

  items.forEach(item => {
    const [keyValue] = item.split(';');
    const [key, value] = keyValue.split('=');
    if (key && value) {
      baggage[key.trim()] = decodeURIComponent(value);
    }
  });

  return baggage;
}

/**
 * Create traceparent header for outgoing requests
 * Format: 00-traceid-spanid-flags
 */
export function createTraceParent() {
  const context = getTraceContext();
  if (!context) return null;

  const flags = '01'; // sampled
  return `00-${context.traceId}-${context.spanId}-${flags}`;
}

/**
 * Create baggage header for outgoing requests
 */
export function createBaggage() {
  const context = getTraceContext();
  if (!context || Object.keys(context.baggage).length === 0) return null;

  return Object.entries(context.baggage)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join(',');
}

/**
 * Calculate request duration
 */
export function getTraceDuration() {
  const context = getTraceContext();
  if (!context) return 0;
  return Date.now() - context.startTime;
}

/**
 * Middleware for trace context management
 */
export function traceContextMiddleware(req, res, next) {
  const context = initTraceContext(req);

  // Set trace headers immediately (before async context)
  res.set('X-Trace-Id', context.traceId);
  res.set('X-Span-Id', context.spanId);
  const flags = '01';
  res.set('traceparent', `00-${context.traceId}-${context.spanId}-${flags}`);

  // Add trace context to request for downstream use
  req.traceContext = context;

  // Run remaining middleware in trace context
  runWithTraceContext(context, () => {
    next();
  });
}

export class TraceContextError extends Error {
  constructor(message, context = null) {
    super(message);
    this.name = 'TraceContextError';
    this.traceId = context?.traceId || getTraceId();
    this.spanId = context?.spanId;
    this.timestamp = new Date().toISOString();
  }
}
