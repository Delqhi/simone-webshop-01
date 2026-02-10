/**
 * Metrics collection middleware for OpenDocs production deployment
 * Collects request metrics, response times, and performance data
 * Best Practices February 2026 Compliant
 */

import type { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

/**
 * Request metrics interface
 */
export interface RequestMetrics {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

/**
 * Application metrics collector
 */
export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: RequestMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 requests

  private constructor() {}

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  /**
   * Add a metric record
   */
  addMetric(metric: RequestMetrics): void {
    this.metrics.push(metric);
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Get metrics summary
   */
  getSummary(): {
    totalRequests: number;
    avgResponseTime: number;
    statusCodes: Record<number, number>;
    topEndpoints: Array<{ path: string; count: number; avgTime: number }>;
  } {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        avgResponseTime: 0,
        statusCodes: {},
        topEndpoints: []
      };
    }

    const statusCodes: Record<number, number> = {};
    const endpointStats: Record<string, { count: number; totalTime: number }> = {};
    let totalResponseTime = 0;

    this.metrics.forEach(metric => {
      // Status code counts
      statusCodes[metric.statusCode] = (statusCodes[metric.statusCode] || 0) + 1;
      
      // Endpoint statistics
      if (!endpointStats[metric.path]) {
        endpointStats[metric.path] = { count: 0, totalTime: 0 };
      }
      endpointStats[metric.path].count++;
      endpointStats[metric.path].totalTime += metric.responseTime;
      
      totalResponseTime += metric.responseTime;
    });

    // Calculate top endpoints
    const topEndpoints = Object.entries(endpointStats)
      .map(([path, stats]) => ({
        path,
        count: stats.count,
        avgTime: Math.round(stats.totalTime / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalRequests: this.metrics.length,
      avgResponseTime: Math.round(totalResponseTime / this.metrics.length),
      statusCodes,
      topEndpoints
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }
}

/**
 * Metrics middleware
 * Collects request/response metrics for monitoring
 */
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = nanoid();

  // Add request ID to headers
  res.setHeader('X-Request-ID', requestId);

  // Override res.end to capture metrics
  const originalEnd = res.end.bind(res);
  
  // Implement proper function overloads for res.end
  const newEnd = function(chunk?: unknown, encodingOrCallback?: BufferEncoding | (() => void), callback?: () => void): Response {
    const responseTime = Date.now() - startTime;
    
    // Handle overloaded signature - if second param is a function, it's actually the callback
    const actualCallback = typeof encodingOrCallback === 'function' ? encodingOrCallback : callback;
    const actualEncoding = typeof encodingOrCallback === 'string' ? encodingOrCallback : undefined;
    
    // Collect metrics
    const metrics: RequestMetrics = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] as string,
      ip: req.ip as string
    };

    MetricsCollector.getInstance().addMetric(metrics);

    // Add response time header
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    
    // Call original end function with correct overload
    if (actualEncoding && actualCallback) {
      return originalEnd(chunk, actualEncoding, actualCallback);
    } else if (actualCallback) {
      return originalEnd(chunk, actualCallback as () => void);
    } else if (chunk !== undefined) {
      return originalEnd(chunk);
    } else {
      return originalEnd();
    }
  };
  
  (res.end as typeof res.end) = newEnd as typeof res.end;

  next();
};

/**
 * Metrics endpoint handler
 * Returns collected metrics in JSON format
 */
export const metricsHandler = (_req: Request, res: Response): void => {
  const collector = MetricsCollector.getInstance();
  const summary = collector.getSummary();
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    requestId: nanoid(),
    metrics: summary
  });
};

/**
 * Reset metrics endpoint
 * Clears all collected metrics
 */
export const resetMetricsHandler = (_req: Request, res: Response): void => {
  const collector = MetricsCollector.getInstance();
  collector.clear();
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Metrics cleared successfully',
    requestId: nanoid()
  });
};