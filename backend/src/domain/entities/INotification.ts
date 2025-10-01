
import { Types } from "mongoose";
import { IRole } from "./IUser";
export type IType = "info" | "warning" | "success" | "error"|"request"|"alert";
export type IEntityType = "booking" | "package" |"customPacakage"| "review" | "wallet" | 'report'|'follow';
export interface INotification {
  _id: string;
  userId?: Types.ObjectId;
  role: IRole,
  title: string;
  message: string;
  entityType: IEntityType,
  type: IType,
  isRead: boolean;
  packageId?: Types.ObjectId;
  bookingId?: Types.ObjectId;
  reportedId?: Types.ObjectId;
  customPackageId?:Types.ObjectId;
  walletId?: Types.ObjectId;
  metadata?: Record<string, any>;
  triggeredBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

}

export interface INotificationFilter {
  status?: string;       
  type?: IType;          
  entityType?: IEntityType;  
}
