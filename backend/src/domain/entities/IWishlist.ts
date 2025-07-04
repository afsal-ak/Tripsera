import { Types } from "mongoose";
export interface IWishlist{
    userId: Types.ObjectId;
    packageId: Types.ObjectId;
    addedAt?:Date;
    
}