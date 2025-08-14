import { CreateReportDTO } from "@application/dtos/ReportDTO";
import { IReportUseCases } from "@application/useCaseInterfaces/user/IReportUseCases";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { IReport } from "@domain/entities/IReport";
import { IReportRepository } from "@domain/repositories/IReportRepository";
import { AppError } from "@shared/utils/AppError";

export class ReportUseCases implements IReportUseCases{
    constructor(private readonly _reportRepo:IReportRepository){}

    async createReport(data: CreateReportDTO): Promise<IReport> {
        const {reportedId,reporterId}=data
        const existingReport =await this._reportRepo.existingReport(reportedId,reporterId)
        if(existingReport ){
            throw new AppError(HttpStatus.CONFLICT,'This content has already been reported by you')
        }
        return await this._reportRepo.create(data)
    }
        
    

}