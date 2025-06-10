
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "@infrastructure/models/User";
import { IUser } from "@domain/entities/IUser";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: Token not provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!JWT_ACCESS_SECRET) {
      throw new Error("JWT secret is not defined");
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    if (typeof decoded !== "object" || !("id" in decoded)) {
       res.status(401).json({ message: "Invalid token payload" });
       return
    }

    const user = await UserModel.findById((decoded as { id: string }).id);

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    // if (user.isBlocked) {
    //   res.status(403).json({ message: "Access Denied: User is blocked" });
    //   return;
    // }

    if (user.role!=='admin') {
      res.status(403).json({ message: "Access Denied: Admin only" });
      return;
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { IUser } from '@domain/entities/IUser';
// import { UserModel } from '@infrastructure/models/User';

// const JWT_SECRET = process.env.JWT_SECRET || '';

// export const adminAuthMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//        res.status(401).json({ message: 'Unauthorized: Token not provided' });
//        return
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

//     const userDoc = await UserModel.findById(decoded.id).lean(); // lean returns plain object

//     if (!userDoc) {
//        res.status(401).json({ message: 'Unauthorized: User not found' });
//        return
//     }

//     if (userDoc.role !== 'admin') {
//        res.status(403).json({ message: 'Access Denied: Admin only' });
//        return
//     }

//     req.user = userDoc as IUser; // req.user is of type IUser
//     next();
//   } catch (error) {
//      res.status(401).json({ message: 'Invalid or expired token' });
//      return
//   }
// };
