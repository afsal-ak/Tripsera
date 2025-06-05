import { Types } from "mongoose";
export interface SafeUser  {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
};
