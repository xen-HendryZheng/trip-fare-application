import { Request, Response, NextFunction } from 'express';
// Create middleware for error handler
export function errorHandler() {
    return (err: Error, _: Request, res: Response, __: NextFunction) => {
        // Read error from err and return error message
        res.status(500).json({ error: err.message });
    };
}