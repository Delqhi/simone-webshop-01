/**
 * Enhanced Metrics Collector with Latency Percentiles
 * Phase 5.05: Distributed tracing metrics
 */

import { nanoid } from 'nanoid';
import { getTraceContext, getTraceDuration } from './trace-context.js';

class MetricsCollector {
  constructor() {
    this.requests = [];
    this.maxRequests = 10000;
  }

  recordRequest(method, path, statusCode, duration, errorType = null) {
    const request = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      method,
      path,
      statusCode,
      duration,
      errorType,
      traceContext: getTraceContext(),
    };

    this.requests.push(request);
    if (this.requests.length > this.maxRequests) {
      this.requests.shift();
    }

    return request;
  }

  getLatencyPercentiles(path = null) {
    let requests = this.requests;

    if (path) {
      requests = requests.filter(r => r.path === path);
    }

    const durations = requests.map(r => r.duration).sort((a, b) => a - b);
    if (durations.length === 0) return { p50: 0, p95: 0, p99: 0, min: 0, max: 0, mean: 0 };

    const p50 = this.percentile(durations, 0.5);
    const p95 = this.percentile(durations, 0.95);
    const p99 = this.percentile(durations, 0.99);
    const min = durations[0];
    const max = durations[durations.length - 1];
    const mean = durations.reduce((a, b) => a + b, 0) / durations.length;

    return { p50, p95, p99, min, max, mean };
  }

  getErrorRateByEndpoint() {
    const endpoints = {};

    this.requests.forEach(req => {
      const key = `${req.method} ${req.path}`;
      if (!endpoints[key]) {
        endpoints[key] = { total: 0, errors: 0, rate: 0 };
      }
      endpoints[key].total++;
      if (req.statusCode >= 400) {
        endpoints[key].errors++;
      }
    });

    Object.values(endpoints).forEach(ep => {
      ep.rate = ep.total > 0 ? ((ep.errors / ep.total) * 100).toFixed(2) + '%' : '0%';
    });

    return endpoints;
  }

  getResponseSizeDistribution() {
    const distribution = {
      small: 0,
      medium: 0,
      large: 0,
      huge: 0
    };

    this.requests.forEach(req => {
      if (req.duration < 50) distribution.small++;
      else if (req.duration < 200) distribution.medium++;
      else if (req.duration < 1000) distribution.large++;
      else distribution.huge++;
    });

    return distribution;
  }

  getMetricsSnapshot() {
    return {
      totalRequests: this.requests.length,
      latencyPercentiles: this.getLatencyPercentiles(),
      errorRateByEndpoint: this.getErrorRateByEndpoint(),
      responseSizeDistribution: this.getResponseSizeDistribution(),
      timeRange: {
        from: this.requests[0]?.timestamp,
        to: this.requests[this.requests.length - 1]?.timestamp
      }
    };
  }

  percentile(sorted, p) {
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }

  clearMetrics() {
    const count = this.requests.length;
    this.requests = [];
    return count;
  }
}

const collector = new MetricsCollector();

export function recordMetric(method, path, statusCode, duration, errorType = null) {
  return collector.recordRequest(method, path, statusCode, duration, errorType);
}

export function metricsHandler(req, res) {
  const path = req.query.path || null;
  const snapshot = collector.getMetricsSnapshot();

  if (path) {
    snapshot.latencyPercentiles = collector.getLatencyPercentiles(path);
  }

  res.json({
    requestId: req.headers['x-request-id'] || nanoid(),
    timestamp: new Date().toISOString(),
    metrics: snapshot
  });
}

export function clearMetricsHandler(req, res) {
  const count = collector.clearMetrics();

  res.json({
    success: true,
    message: `Cleared ${count} metric entries`,
    timestamp: new Date().toISOString()
  });
}

export function enhancedMetricsMiddleware(req, res, next) {
  const startTime = Date.now();
  let recorded = false;

  function recordRequest() {
    if (recorded) return;
    recorded = true;
    const duration = Date.now() - startTime;
    const errorType = res.statusCode >= 400 ? `HTTP${res.statusCode}` : null;
    recordMetric(req.method, req.path, res.statusCode, duration, errorType);
  }

  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    recordRequest();
    originalEnd.call(this, chunk, encoding);
  };

  res.on('finish', recordRequest);

  next();
}

export { collector };
