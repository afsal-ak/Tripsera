import { Types } from 'mongoose';

export interface IFollow {
  _id?: Types.ObjectId | string;
  follower: Types.ObjectId | string;
  following: Types.ObjectId | string;
  status: 'pending' | 'accepted' | 'blocked';
  requestedAt?: Date;
  acceptedAt?: Date;
  unfollowedAt?: Date;
  blockedBy?: Types.ObjectId | string; // who blocked whom (if status=blocked)
  createdAt?: Date;
  updatedAt?: Date;
}
