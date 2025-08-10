import { Types } from 'mongoose';
export interface IReview {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  username: string;
  packageId: Types.ObjectId | string;
  packageTitle: string;
  rating: number;
  title: string;
  comment: string;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
