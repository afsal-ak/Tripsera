// src/types/express.d.ts
import { IUser } from "@domain/entities/IUser";
import { IUserPreview } from "@domain/entities/IUserPreview ";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
