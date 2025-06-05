import { Types } from "mongoose";
export interface IBanner{
    _id?:Types.ObjectId|string;
    title:string;
    description?:string;
    imageUrl:string;
    
}