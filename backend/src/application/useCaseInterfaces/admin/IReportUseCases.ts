import { IFilter } from "@domain/entities/IFilter";
 import { EnumReportStatus } from "@constants/enum/reportEnum";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { ReportSingleResponseDTO, ReportTableResponseDTO} from "@application/dtos/ReportDTO";

export interface IReportUseCases {
    getAllReports(
        page: number,
        limit: number,
        filters: IFilter
    ): Promise<{ report: ReportTableResponseDTO[], pagination: PaginationInfo }>
    getById(id: string): Promise<ReportSingleResponseDTO | null>
    changeReportStatus(id: string, status: EnumReportStatus): Promise<boolean>
}