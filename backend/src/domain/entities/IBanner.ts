import { Types } from "mongoose";


export interface IBanner{
    _id?:Types.ObjectId|string;
    title:string;
    description?:string;
 image: {
    url: string;
    public_id: string;
  };
  isBlocked?:boolean    
}