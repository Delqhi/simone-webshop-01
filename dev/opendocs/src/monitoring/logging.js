/**
 * Structured Logging Middleware
 * Best Practices February 2026 Compliant
 */

import { nanoid } from 'nanoid';

class LogCollector {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs
  }

  addLog(level, message, meta = {}) {
    const logEntry = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    };

    this.logs.push(logEntry);
    
    // Maintain max log size
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also output to console for development
    console.log(`[${level.toUpperCase()}] ${message}`, meta);

    return logEntry;
  }

  getLogs(limit = 100, level = null) {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }

    return filteredLogs.slice(-limit);
  }

  clearLogs() {
    const count = this.logs.length;
    this.logs = [];
    return count;
  }

  getStats() {
    const levels = {};
    this.logs.forEach(log => {
      levels[log.level] = (levels[log.level] || 0) + 1;
    });

    return {
      total: this.logs.length,
      byLevel: levels,
      oldest: this.logs[0]?.timestamp,
      newest: this.logs[this.logs.length - 1]?.timestamp
    };
  }
}

const collector = new LogCollector();

export function loggingMiddleware(req, res, next) {
  const requestId = req.headers['x-request-id'] || nanoid();
  const startTime = Date.now();

  // Log request start
  collector.addLog('info', `Request started: ${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  });

  // Override res.end to capture response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    
    collector.addLog('info', `Request completed: ${req.method} ${req.path}`, {
      requestId,
      statusCode: res.statusCode,
      responseTime,
      contentLength: res.getHeader('content-length') || chunk?.length || 0
    });
    
    originalEnd.call(this, chunk, encoding);
  };

  next();
}

export function logsHandler(req, res) {
  const limit = parseInt(req.query.limit) || 100;
  const level = req.query.level || null;
  
  const logs = collector.getLogs(limit, level);
  const stats = collector.getStats();

  res.json({
    requestId: req.headers['x-request-id'] || nanoid(),
    timestamp: new Date().toISOString(),
    logs,
    stats,
    limit,
    level
  });
}

export function clearLogsHandler(req, res) {
  const count = collector.clearLogs();
  
  res.json({
    success: true,
    message: `Cleared ${count} log entries`,
    timestamp: new Date().toISOString()
  });
}

// Export convenience functions for use throughout the application
export function logInfo(message, meta = {}) {
  return collector.addLog('info', message, meta);
}

export function logError(message, meta = {}) {
  return collector.addLog('error', message, meta);
}

export function logWarn(message, meta = {}) {
  return collector.addLog('warn', message, meta);
}

export function logDebug(message, meta = {}) {
  return collector.addLog('debug', message, meta);
}