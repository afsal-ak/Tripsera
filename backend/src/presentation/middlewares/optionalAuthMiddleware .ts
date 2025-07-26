import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '@domain/entities/IUser';
import { UserModel } from '@infrastructure/models/User';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // If no token, just move on (guest user)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!JWT_ACCESS_SECRET) {
      console.error('JWT_ACCESS_SECRET is not set in environment');
      return next();
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    if (typeof decoded !== 'object' || !('id' in decoded)) {
      return next(); // Invalid token, treat as guest
    }

    const user = await UserModel.findById((decoded as { id: string }).id);
    if (!user) {
      return next(); // User not found, treat as guest
    }

    if (user.isBlocked) {
      // Still attach user info but mark them as blocked
      req.user = { ...user.toObject(), isBlocked: true } as IUser;
      return next();
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    // If token invalid or expired, just proceed as guest
    next();
  }
};
