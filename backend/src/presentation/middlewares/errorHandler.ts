import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';

  console.error(`[Error]:`, err);

  res.status(statusCode).json({
    success: false,
    message,
  });
};
