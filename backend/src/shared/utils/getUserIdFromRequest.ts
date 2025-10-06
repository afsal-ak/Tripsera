import { Request } from 'express';
import { AppError } from './AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export const getUserIdFromRequest = (req: Request): string => {
  const userId = req.user?._id;
  if (!userId) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  return userId.toString();
};
