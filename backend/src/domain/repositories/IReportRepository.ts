import { IReport } from '@domain/entities/IReport';
import { EnumReportStatus } from '@constants/enum/reportEnum';
import { BaseRepository } from '@infrastructure/repositories/BaseRepository';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { IFilter } from '@domain/entities/IFilter';
import { IReportTableAggregate } from '@infrastructure/db/types.ts/IReportTableAggregate';

export interface IReportRepository extends BaseRepository<IReport> {
  findAllReports(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<{ report: IReportTableAggregate[]; pagination: PaginationInfo }>;

  updateReportStatus(id: string, status: EnumReportStatus): Promise<boolean>;
  existingReport(reportedId: string, reporterId: string): Promise<boolean>;
}
