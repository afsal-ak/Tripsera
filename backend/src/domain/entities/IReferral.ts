import { Types } from "mongoose";

export interface IReferral{
  _id?: Types.ObjectId | string;
  amount:number;
  isBlocked:boolean;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}