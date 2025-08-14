import { IReport, IReportedType, IReportStatus, IAdminAction } from "@domain/entities/IReport";

export interface CreateReportDTO {
  reportedId: string;
  reporterId: string;
  reportedType: IReportedType;
  reason: string;
  description?: string;
}


export interface UpdateReportDTO {
  reportId: string;
  reportedId: string;
  reportedType: IReportedType;
  adminAction: IAdminAction;
  status: IReportStatus;
  isBlocked: "active" | "block"
}


export interface ReportSingleResponseDTO {
  _id: string;
  reportedId: string;
  reporterId: string;
  reason: string;
  description?: string;
  reportedType: string;

  status: IReportStatus;
  adminAction: IAdminAction;
  createdAt: Date;
  updatedAt: Date;
}

export const toReportSingleResponseDTO = (report: IReport): ReportSingleResponseDTO => {
  return {
    _id: report._id!.toString(),
    reportedId: report.reportedId as string,
    reporterId: report.reporterId as string,
    reason: report.reason,
    description: report.description,
    reportedType: report.reportedType,
    status: report.status,
    adminAction: report.adminAction,
    createdAt: report.createdAt!,
    updatedAt: report.updatedAt!,
  };
};

export interface ReportResponseDTO {
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

export const toReportResponseDTO = (report: any): ReportResponseDTO => {
  return {
    _id: report._id?.toString(),
    reportedType: report.reportedType,
    reason: report.reason,
    description: report.description,
    status: report.status,
    adminAction: report.adminAction,
    createdAt: report.createdAt,
    reporterUserName: report.reporterUserName,
    reportedUserName: report.reportedUserName,
    blogTitle: report.blogTitle,
    blogOwner: report.blogOwner,
    reviewTitle: report.reviewTitle,
    reviewOwner: report.reviewOwner,
  };
};
