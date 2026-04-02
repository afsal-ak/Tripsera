import {
  IBookingsChartData,
  IDashboardSummary,
  IDateFilter,
  ITopCategory,
  ITopPackage,
} from '@application/dtos/DashboardDTO';

export interface IDashboardUseCases {
  getCompanyDashboardSummary(companyId:string,filter?: IDateFilter): Promise<IDashboardSummary>;
  getCompanyTopBookedPackages(companyId:string,filter?: IDateFilter): Promise<ITopPackage[]>;
  getCompanyTopBookedCategories(companyId:string,filter?: IDateFilter): Promise<ITopCategory[]>;

  getCompanyBookingsChartData(companyId:string,filter?: IDateFilter): Promise<IBookingsChartData[]>;
}
