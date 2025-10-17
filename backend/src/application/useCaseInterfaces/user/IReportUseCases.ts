
import { IReport } from "@domain/entities/IReport";
import { CreateReportDTO ,ReportSingleResponseDTO} from "@application/dtos/ReportDTO";

export interface IReportUseCases{
  createReport(data: CreateReportDTO): Promise<ReportSingleResponseDTO>;
  
}
