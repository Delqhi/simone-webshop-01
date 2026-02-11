import type { Request, Response, NextFunction } from 'express';
export declare function createErrorMiddleware(): (error: unknown, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
