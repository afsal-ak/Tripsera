import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/utils/AppError';
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';

  console.error(`[Error]:`, err);

  res.status(statusCode).json({
    success: false,
    message,
  });
};
