import { Request } from 'express';
import { AppError } from './AppError';

export const getUserIdFromRequest = (req: Request): string => {
  const userId = req.user?._id;
  if (!userId) {
    throw new AppError(401, 'Unauthorized');
  }
  return userId.toString();
};
