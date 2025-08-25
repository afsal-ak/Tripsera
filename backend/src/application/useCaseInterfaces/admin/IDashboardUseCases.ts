import { IBookingsChartData, IDashboardSummary,IDateFilter, ITopCategory, ITopPackage } from "@application/dtos/DashboardDTO";

export interface IDashboardUseCases {
  getDashboardSummary(filter?: IDateFilter): Promise<IDashboardSummary>;
   getTopBookedPackages(filter?: IDateFilter): Promise<ITopPackage[]>;
   getTopBookedCategories(filter?: IDateFilter): Promise<ITopCategory[]>;
 
   getBookingsChartData (filter?: IDateFilter):Promise<IBookingsChartData[]>
// ):Promise<IBookingsChartData>
 
}
