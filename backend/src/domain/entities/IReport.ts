import { Types } from "mongoose";

export type IReportedType = "blog" | "review" | "user";
export type IReportStatus = "pending" | "resolved" | "dismissed";
export type IAdminAction = "warn" | "block" | "delete" | "none";

export interface IReport {
  _id?: string;
  reportedId: Types.ObjectId | string;
  reporterId:Types.ObjectId | string;
  reportedType: IReportedType;
  reason: string;
  description?: string;
  status: IReportStatus;
  adminAction: IAdminAction;
  createdAt?: Date;
  updatedAt?: Date;
}
