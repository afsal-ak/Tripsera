import { PaginationInfo } from "@application/dtos/PaginationDto";
import { IReportUseCases } from "@application/useCaseInterfaces/admin/IReportUseCases";
import { IFilter } from "@domain/entities/IFilter";
import { IReport, IReportStatus } from "@domain/entities/IReport";
import { IReportRepository } from "@domain/repositories/IReportRepository";

export class ReportUseCases implements IReportUseCases {
    constructor( private readonly _reportRepo: IReportRepository ) {}

    async getAllReports(page: number, limit: number, filters: IFilter): Promise<{ report: IReport[]; pagination: PaginationInfo; }> {
        return await this._reportRepo.findAllReports(page, limit, filters)
    }

    async getById(id: string): Promise<IReport | null> {
        return await this._reportRepo.findById(id)
    }

   
    async changeReportStatus(id: string, status: IReportStatus): Promise<boolean> {
        const report = await this._reportRepo.update(id, { status })
        return !!report 
    }

}