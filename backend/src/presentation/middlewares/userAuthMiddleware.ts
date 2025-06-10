 
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "@domain/entities/IUser";
import { UserModel } from "@infrastructure/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export const userAuthMiddleware = async (
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

    if (!JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Type narrowing check
    if (typeof decoded !== "object" || !("id" in decoded)) {
       res.status(401).json({ message: "Invalid token payload" });
       return
    }

    const user = await UserModel.findById((decoded as { id: string }).id);

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({ message: "Access Denied: User is blocked" });
      return;
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
