import { IBanner } from "@domain/entities/IBanner";
import mongoose, { Schema, Document } from "mongoose";

export interface IBannerDocument extends Omit<IBanner, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}
const BannerSchema = new Schema<IBannerDocument>({
    title: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required:false
    },
    // imageUrl: {
    //     type: String,
    //     required: true
    // }
    image: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
}
},
    {
        timestamps: true
    }
)

export const BannerModel=mongoose.model<IBannerDocument>("Banner",BannerSchema)