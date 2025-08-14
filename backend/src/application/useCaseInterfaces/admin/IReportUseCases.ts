 import { IFilter } from "@domain/entities/IFilter";
import { IReport, IReportStatus } from "@domain/entities/IReport";
 import { PaginationInfo } from "@application/dtos/PaginationDto";

export interface IReportUseCases {
    getAllReports(
        page:number,
        limit:number,
        filters:IFilter
    ):Promise<{report:IReport[],pagination:PaginationInfo}>
     getById(id:string):Promise<IReport|null>
      changeReportStatus(id:string,status:IReportStatus):Promise<boolean>
 }