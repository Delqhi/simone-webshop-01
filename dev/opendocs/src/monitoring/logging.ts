import type { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  requestId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  userAgent?: string;
  ip?: string;
  duration?: number;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(entry: LogEntry): void {
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    console.log(JSON.stringify(entry));
  }

  info(message: string, context?: Partial<LogEntry>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...context
    });
  }

  warn(message: string, context?: Partial<LogEntry>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      ...context
    });
  }

  error(message: string, context?: Partial<LogEntry>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      ...context
    });
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = nanoid();

  // Store requestId in response header (Express Request doesn't have id property)
  res.setHeader('X-Request-ID', requestId);

  const logger = Logger.getInstance();

  logger.info('Request started', {
    requestId,
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });

  const originalEnd = res.end;
  
  res.end = function(chunk?: unknown, encoding?: BufferEncoding | (() => void), callback?: () => void): Response {
    const duration = Date.now() - startTime;
    
    // Handle case where encoding is actually the callback
    let actualCallback = callback;
    if (typeof encoding === 'function') {
      actualCallback = encoding;
      encoding = undefined;
    }
    
    logger.info('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration
    });
    
    res.setHeader('X-Response-Time', `${duration}ms`);
    return originalEnd.call(this, chunk, encoding as BufferEncoding, actualCallback);
  };

  next();
};

export const logsHandler = (_req: Request, res: Response): void => {
  const logger = Logger.getInstance();
  const logs = logger.getLogs();
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    requestId: nanoid(),
    logs: logs.slice(-100)
  });
};

export const clearLogsHandler = (_req: Request, res: Response): void => {
  const logger = Logger.getInstance();
  logger.clear();
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Logs cleared successfully',
    requestId: nanoid()
  });
};