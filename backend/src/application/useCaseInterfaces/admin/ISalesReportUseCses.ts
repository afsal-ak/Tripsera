import { SalesReportResponseDTO } from '@application/dtos/salesReportDTO';
import { FilterQueryOptions } from '@application/usecases/helpers/getSalesReportFilter';

export interface ISalesReportUseCase {
  getReportList(
    query: FilterQueryOptions,
    page: number,
    limit: number
  ): Promise<{
    data: SalesReportResponseDTO[];
    total: number;
    summary: any;
    page: number;
    totalPages: number;
  }>;
  downloadExcel(query: FilterQueryOptions): Promise<Buffer>;
  downloadPDF(query: FilterQueryOptions): Promise<Buffer>;
}
