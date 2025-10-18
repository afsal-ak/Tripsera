import {
  EnumAdminAction,
  EnumReportStatus,
  EnumReportedType,
  EnumReportBlockStatus,
} from '@constants/enum/reportEnum';

export interface CreateReportDTO {
  reportedId: string;
  reporterId: string;
  reportedType: EnumReportedType;
  reason: string;
  description?: string;
}

export interface UpdateReportDTO {
  reportId: string;
  reportedId: string;
  reportedType: EnumReportedType;
  adminAction: EnumAdminAction;
  status: EnumReportStatus;
  isBlocked: EnumReportBlockStatus;
}

export interface ReportSingleResponseDTO {
  _id: string;
  reportedId: string;
  reporterId: string;
  reason: string;
  description?: string;
  reportedType: string;

  status: EnumReportStatus;
  adminAction: EnumAdminAction;
  createdAt: Date;
  updatedAt: Date;
}
export interface ReportTableResponseDTO {
  _id: string;
  reportedType: string;
  reason: string;
  description?: string;
  status: string;
  adminAction: string;
  createdAt: Date;

  // Reporter
  reporterUserName?: string;

  // If reportedType = user
  reportedUserName?: string;

  // If reportedType = blog
  blogTitle?: string;
  blogOwner?: string;

  // If reportedType = review
  reviewTitle?: string;
  reviewOwner?: string;
}
