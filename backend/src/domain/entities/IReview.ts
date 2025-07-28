import { Types } from "mongoose";
export interface IReview {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  packageId: Types.ObjectId | string;
  rating: number;
  comment:string;           
  isBlocked?: boolean;       
  createdAt?: Date;
  updatedAt?: Date;
}
