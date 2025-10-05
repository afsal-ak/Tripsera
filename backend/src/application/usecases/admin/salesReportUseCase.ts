import { ISalesReportRepository } from '@domain/repositories/ISalesReportRepository';
import { getSalesReportFilter, FilterQueryOptions } from '../helpers/getSalesReportFilter';
import { exportSalesReportExcel } from '@shared/utils/excelUtils';
import { exportSalesReportPDF } from '@shared/utils/pdfUtils';
import { IBooking } from '@domain/entities/IBooking';
import { ISalesReportUseCase } from '@application/useCaseInterfaces/admin/ISalesReportUseCses';

export class SalesReportUseCase implements ISalesReportUseCase {

  constructor(private _salesRepo: ISalesReportRepository) {}

  async getReportList(query: FilterQueryOptions, page: number, limit: number):Promise<{
    data: IBooking[];
    total: number;
    summary: any;
    page: number;
    totalPages: number;
}> {
    const filter = getSalesReportFilter(query);
    const skip = (page - 1) * limit;

    const total = await this._salesRepo.count(filter);
    const data = await this._salesRepo.find(filter, {
      skip,
      limit,
      sort: { createdAt: -1 },
    });
    const summary = await this._salesRepo.calculateSummary(filter);

    return {
      data,
      total,
      summary,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Download report as Excel
  async downloadExcel(query: FilterQueryOptions): Promise<Buffer> {
    const filter = getSalesReportFilter(query);
    const bookings: IBooking[] = await this._salesRepo.find(filter, {
      sort: { createdAt: -1 },
    });

    const summary = await this._salesRepo.calculateSummary(filter);
    const buffer = await exportSalesReportExcel(bookings, summary);
    return buffer;
  }

    async downloadPDF(query: FilterQueryOptions): Promise<Buffer> {
    const filter = getSalesReportFilter(query);
    const bookings: IBooking[] = await this._salesRepo.find(filter, {
      sort: { createdAt: -1 },
    });

    const summary = await this._salesRepo.calculateSummary(filter);
    const buffer = await exportSalesReportPDF(bookings, summary);
    return buffer;
  }
}
