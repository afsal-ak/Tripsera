import { SalesReportResponseDTO } from '@application/dtos/salesReportDTO';
import { FilterQueryOptions } from '@application/usecases/helpers/getSalesReportFilter';

export interface ISalesReportUseCase {
  getCompanyReportList(
    companyId: string,
    //     role: string,

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
  downloadExcel(companyId: string,
    query: FilterQueryOptions): Promise<Buffer>;
  downloadPDF(companyId: string,
    query: FilterQueryOptions): Promise<Buffer>;
}
