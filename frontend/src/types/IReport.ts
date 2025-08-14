
export type IReportedType = "blog" | "review" | "user";
export type IReportStatus = "pending" | "resolved" | "dismissed";
export type IAdminAction = "warn" | "block" | "delete" | "none";

export interface IReport {

  _id: string;
  reportedId: string;
  reporterId: string;
  reportedType: IReportedType;
  reason: string;
  description?: string;
  status: IReportStatus;
  adminAction: IAdminAction;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateReport {
  reportedType: IReportedType;
  reason: string;
  description: string;
}


export interface UpdateReportDTO {
  reportId: string;
  reportedId: string;
  reportedType: IReportedType;
  adminAction: IAdminAction;
  status: IReportStatus;
  isBlocked: "active" | "block"
}

export type ISelectedReport = {
  _id: string;
  reportedType: IReportedType
};



export interface IAdminReport {
  _id: string;
  reportedType: string;
  reason: string;
  description?: string;
  status: IReportStatus;
  adminAction: IAdminAction;
  createdAt: Date;
  reporterUserName?: string;
  reportedUserName?: string;
  blogTitle?: string;
  blogOwner?: string;
  reviewTitle?: string;
  reviewOwner?: string;
}