import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '@infrastructure/models/User';
import { IUser } from '@domain/entities/IUser';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { EnumUserRole } from '@constants/enum/userEnum';
import { AppError } from '@shared/utils/AppError';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;


export const companyAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user || user.role !== EnumUserRole.COMPANY) {
    throw new AppError(HttpStatus.UNAUTHORIZED, "Company access required");
  }

  next();
};