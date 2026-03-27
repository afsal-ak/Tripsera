import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '@domain/entities/IUser';
import { UserModel } from '@infrastructure/models/User';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const companyAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized: Token not provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!JWT_ACCESS_SECRET) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server error: Missing JWT secret' });
      return;
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    if (typeof decoded !== 'object' || !('id' in decoded)) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token payload' });
      return;
    }

    const user = await UserModel.findById((decoded as { id: string }).id);

    if (!user) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized: User not found' });
      return;
    }

    if (user.isBlocked) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Access Denied: User is blocked' });
      return;
    }

    if (user.role !== 'company') {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Access Denied: Company access only' });
      return;
    }

    req.user = user as IUser;

    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
};

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { UserModel } from '@infrastructure/models/User';
// import { IUser } from '@domain/entities/IUser';
// import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
// import { EnumUserRole } from '@constants/enum/userEnum';
// import { AppError } from '@shared/utils/AppError';
// const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;


// export const companyAuthMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user;

//   if (!user || user.role !== EnumUserRole.COMPANY) {
//     throw new AppError(HttpStatus.UNAUTHORIZED, "Company access required");
//   }

//   next();
// };