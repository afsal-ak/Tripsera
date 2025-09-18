
import { Types } from "mongoose";

export interface UserBasicInfoDto {
  _id: Types.ObjectId | string;
  username?: string;
  email?: string;
  profileImage?:string
}
