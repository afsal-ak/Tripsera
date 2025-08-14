import { IReport, IReportedType, IReportStatus } from "@domain/entities/IReport";
import { BaseRepository } from "@infrastructure/repositories/BaseRepository";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { IFilter } from "@domain/entities/IFilter";


export interface IReportRepository extends BaseRepository<IReport>{
    findAllReports(
        page:number,
        limit:number,
        filters?:IFilter
    ):Promise<{report:IReport[],pagination:PaginationInfo}>

      updateReportStatus(id:string,status:IReportStatus):Promise<boolean>
      existingReport (reportedId:string,reporterId:string):Promise<boolean>
}
