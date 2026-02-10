/**
 * Metrics Collection Middleware
 * Best Practices February 2026 Compliant
 */

import { nanoid } from 'nanoid';

class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        byStatus: {},
        byEndpoint: {},
        responseTimes: []
      },
      memory: {
        usage: [],
        timestamps: []
      }
    };
  }

  recordRequest(endpoint, statusCode, responseTime) {
    this.metrics.requests.total++;
    
    // Status code tracking
    this.metrics.requests.byStatus[statusCode] = (this.metrics.requests.byStatus[statusCode] || 0) + 1;
    
    // Endpoint tracking
    this.metrics.requests.byEndpoint[endpoint] = (this.metrics.requests.byEndpoint[endpoint] || 0) + 1;
    
    // Response time tracking (keep last 100)
    this.metrics.requests.responseTimes.push(responseTime);
    if (this.metrics.requests.responseTimes.length > 100) {
      this.metrics.requests.responseTimes.shift();
    }

    // Memory usage tracking (sample every 10th request)
    if (this.metrics.requests.total % 10 === 0) {
      this.metrics.memory.usage.push(process.memoryUsage());
      this.metrics.memory.timestamps.push(new Date().toISOString());
      
      if (this.metrics.memory.usage.length > 50) {
        this.metrics.memory.usage.shift();
        this.metrics.memory.timestamps.shift();
      }
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  resetMetrics() {
    this.metrics = {
      requests: {
        total: 0,
        byStatus: {},
        byEndpoint: {},
        responseTimes: []
      },
      memory: {
        usage: [],
        timestamps: []
      }
    };
  }
}

const collector = new MetricsCollector();

export function metricsMiddleware(req, res, next) {
  const startTime = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    collector.recordRequest(req.path, res.statusCode, responseTime);
    
    originalEnd.call(this, chunk, encoding);
  };

  next();
}

export function metricsHandler(req, res) {
  const requestId = req.headers['x-request-id'] || nanoid();
  
  res.json({
    requestId,
    timestamp: new Date().toISOString(),
    metrics: collector.getMetrics()
  });
}

export function resetMetricsHandler(req, res) {
  collector.resetMetrics();
  
  res.json({
    success: true,
    message: 'Metrics reset successfully',
    timestamp: new Date().toISOString()
  });
}