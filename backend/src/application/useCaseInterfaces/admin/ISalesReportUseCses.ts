import { FilterQueryOptions } from "@application/usecases/helpers/getSalesReportFilter"
import { IBooking } from "@domain/entities/IBooking";
export interface ISalesReportUseCase {


    getReportList(query: FilterQueryOptions, page: number, limit: number): Promise<{
        data: IBooking[];
        total: number;
        summary: any;
        page: number;
        totalPages: number;
    }>
    downloadExcel(query: FilterQueryOptions): Promise<Buffer>
    downloadPDF(query: FilterQueryOptions): Promise<Buffer>

}
