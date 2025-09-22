// src/types/express.d.ts
import { IUser } from '@domain/entities/IUser';
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      isBlockedByTarget?: boolean; 

    }
  }
}

export {};
