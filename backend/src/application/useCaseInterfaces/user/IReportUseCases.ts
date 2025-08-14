
import { IReport } from "@domain/entities/IReport";
import { CreateReportDTO } from "@application/dtos/ReportDTO";

export interface IReportUseCases{
  createReport(data: CreateReportDTO): Promise<IReport>;
  
}
