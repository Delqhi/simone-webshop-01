import { isOpenDocsError, OpenDocsError } from '../utils/error-types.js';
export function createErrorMiddleware() {
    return (error, _req, res, _next) => {
        if (isOpenDocsError(error)) {
            const statusCode = error.statusCode;
            const headers = {
                'X-Error-Type': error.name,
                'X-Error-Retryable': error.retryable ? 'true' : 'false'
            };
            if (error.retryAfterMs) {
                headers['Retry-After'] = Math.ceil(error.retryAfterMs / 1000).toString();
            }
            return res
                .status(statusCode)
                .set(headers)
                .json(error.toJSON());
        }
        const genericError = new OpenDocsError(error instanceof Error ? error.message : 'Internal server error', 500, true);
        return res
            .status(500)
            .set({
            'X-Error-Type': 'InternalServerError',
            'X-Error-Retryable': 'true',
            'Retry-After': '5'
        })
            .json(genericError.toJSON());
    };
}
