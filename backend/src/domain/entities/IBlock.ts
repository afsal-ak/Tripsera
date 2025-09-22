import { Types } from "mongoose";

export interface IBlock {
  _id?: Types.ObjectId | string;

  blocker: Types.ObjectId | string;   // the user who blocks
  blocked: Types.ObjectId | string;   // the user being blocked

  reason?: string;                     
  createdAt?: Date;                   
  unblockedAt?: Date | null;          // when unblock happened (null = still blocked)
}
