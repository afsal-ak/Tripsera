import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '@domain/entities/IUser';
import { UserModel } from '@infrastructure/models/User';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const userAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    //console.log({authHeader})
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: Token not provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!JWT_ACCESS_SECRET) {
      console.log(' JWT_SECRET not loaded!');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error: Missing JWT secret' });
      return;
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    //  Type narrowing check
    if (typeof decoded !== 'object' || !('id' in decoded)) {
      console.log('hhh');
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token payload' });
      return;
    }

    const user = await UserModel.findById((decoded as { id: string }).id);

    if (!user) {
      console.log('blocked ');

      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: User not found' });
      return;
    }

    if (user.isBlocked) {
      console.log('blocked middleware');
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Access Denied: User is blocked' });
      return;
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
};
