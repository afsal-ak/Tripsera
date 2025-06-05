// import { ObjectId } from "mongoose";

// export interface IUser {
//    Username?: string;
//   Email: string;
//   Phone?: number;
//   Password: string;
//   Role?: 'user' | 'admin';
//   Followers?: string[];
//   Following?: string[];
//   Bio?: string;
//   ProfileImage?: string;
//   Interests?: string[];
//   CreatedAt?: Date;
//   IsBlocked?: boolean;
//   DOB?: Date;
//   FirstName?: string;
//   SecondName?: string;
//   Location?: string;
//   GoogleId?: string;
// }
import { ObjectId,Types } from 'mongoose';

export interface IUser {
  _id?:  Types.ObjectId|string;
  username?: string;
  email: string;
  phone?: number;
  password: string;
  role?: 'user' | 'admin';
  followers?: string[];     // or ObjectId[] if referencing
  following?: string[];
  bio?: string;
  profileImage?: string;
  interests?: string[];
  isBlocked?: boolean;
  dob?: Date;
  firstName?: string;
  secondName?: string;
  location?: string;
  googleId?: string;
}
