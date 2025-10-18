import { PaginationInfo } from "@application/dtos/PaginationDto";
import { IReportUseCases } from "@application/useCaseInterfaces/admin/IReportUseCases";
import { IFilter } from "@domain/entities/IFilter";
import { EnumReportStatus } from "@constants/enum/reportEnum";
import { IReportRepository } from "@domain/repositories/IReportRepository";
import { ReportSingleResponseDTO, ReportTableResponseDTO } from "@application/dtos/ReportDTO";
import { ReportMapper } from "@application/mappers/ReportMapper";

export class ReportUseCases implements IReportUseCases {
    constructor( private readonly _reportRepo: IReportRepository ) {}

    async getAllReports(page: number, limit: number, filters: IFilter): Promise<{ report: ReportTableResponseDTO[]; pagination: PaginationInfo; }> {
        const result=  await this._reportRepo.findAllReports(page, limit, filters)
        return {
            report:result.report.map(ReportMapper.toResponseTableDTO),
            pagination:result.pagination
        }
    }

    async getById(id: string): Promise<ReportSingleResponseDTO | null> {
        const report= await this._reportRepo.findById(id)
        return report?ReportMapper.toSingleResponseDTO(report):null
    }

   
    async changeReportStatus(id: string, status: EnumReportStatus): Promise<boolean> {
        const report = await this._reportRepo.update(id, { status })
        return !!report 
    }

}