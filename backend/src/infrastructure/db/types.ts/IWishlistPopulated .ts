import { Types } from 'mongoose';

export interface IWishlistPopulated {
  _id?: string;
  userId: Types.ObjectId | string;
  packageId: {
    _id: string;
    title: string;
    price: number;
    duration: string;
    location: string;
    imageUrls: string[];
  };
  addedAt?: Date;
}
