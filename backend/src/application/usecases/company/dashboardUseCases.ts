import { IDashboardSummary } from '@application/dtos/DashboardDTO';
import { IDashboardUseCases } from '@application/useCaseInterfaces/company/IDashboardUseCases';
import { IDashboardRepository } from '@domain/repositories/IDashboardRepository';
import { DateUtil } from '@shared/utils/dateUtil';
import {
  IDateFilter,
  ITopCategory,
  ITopPackage,
  IBookingsChartData,
} from '@application/dtos/DashboardDTO';

export class DashboardUseCases implements IDashboardUseCases {
  constructor(private readonly _dashboardRepo: IDashboardRepository) {}

  async getCompanyDashboardSummary(companyId:string,filter?: IDateFilter): Promise<IDashboardSummary> {
    const { startDate, endDate } = DateUtil.getDateRange(
      filter?.filter,
      filter?.startDate,
      filter?.endDate
    );
    const [totalUsers, totalPackages, totalBookings, totalCustomPlans, totalBlogs] =
      await Promise.all([
        this._dashboardRepo.getTotalUsers(startDate, endDate,companyId),
        this._dashboardRepo.getTotalPackages(startDate, endDate,companyId),
        this._dashboardRepo.getTotalBookings(startDate, endDate,companyId),
        this._dashboardRepo.getTotalCustomPlans(startDate, endDate,companyId),
        this._dashboardRepo.getTotalBlogs(startDate, endDate,companyId),
      ]);

    return {
      totalUsers,
      totalPackages,
      totalBookings,
      totalCustomPlans,
      totalBlogs,
    };
  }

  async getCompanyTopBookedPackages(companyId:string,filter?: IDateFilter): Promise<ITopPackage[]> {
    const { startDate, endDate } = DateUtil.getDateRange(
      filter?.filter,
      filter?.startDate,
      filter?.endDate
    );

    return await this._dashboardRepo.getTopBookedPackages(startDate, endDate,companyId);
  }

  async getCompanyTopBookedCategories(companyId:string,filter?: IDateFilter): Promise<ITopCategory[]> {
    const { startDate, endDate } = DateUtil.getDateRange(
      filter?.filter,
      filter?.startDate,
      filter?.endDate
    );

    return await this._dashboardRepo.getTopBookedCategories(startDate, endDate,companyId);
  }

  async getCompanyBookingsChartData(companyId:string,dateFilter: IDateFilter): Promise<IBookingsChartData[]> {
    const { startDate, endDate, groupBy } = DateUtil.getDateRangeAndGroupBy(dateFilter);
    return await this._dashboardRepo.getBookingsChartData(startDate, endDate, groupBy,companyId);
  }
}
