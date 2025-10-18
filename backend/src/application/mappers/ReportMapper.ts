import { IReport } from '@domain/entities/IReport';
import { EnumAdminAction, EnumReportStatus } from '@constants/enum/reportEnum';
import { ReportSingleResponseDTO, ReportTableResponseDTO } from '@application/dtos/ReportDTO';
import { IReportTableAggregate } from '@infrastructure/db/types.ts/IReportTableAggregate';

export abstract class ReportMapper {
  static toSingleResponseDTO(report: IReport): ReportSingleResponseDTO {
    return {
      _id: report._id!.toString(),
      reportedId: report.reportedId.toString(),
      reporterId: report.reporterId.toString(),
      reason: report.reason,
      description: report.description,
      reportedType: report.reportedType,
      status: report.status as EnumReportStatus,
      adminAction: report.adminAction as EnumAdminAction,
      createdAt: report.createdAt!,
      updatedAt: report.updatedAt!,
    };
  }

  static toResponseTableDTO(report: IReportTableAggregate): ReportTableResponseDTO {
    return {
      _id: report._id?.toString() || '',
      reportedType: report.reportedType,
      reason: report.reason,
      description: report.description || '',
      status: report.status,
      adminAction: report.adminAction,
      createdAt: report.createdAt,

      reporterUserName: report.reporterUserName || '',

      reportedUserName: report.reportedUserName || '',
      blogTitle: report.blogTitle || '',
      blogOwner: report.blogOwner || '',
      reviewTitle: report.reviewTitle || '',
      reviewOwner: report.reviewOwner || '',
    };
  }
}
