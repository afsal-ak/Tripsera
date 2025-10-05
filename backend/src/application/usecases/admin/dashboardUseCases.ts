import { IDashboardSummary } from "@application/dtos/DashboardDTO";
import { IDashboardUseCases } from "@application/useCaseInterfaces/admin/IDashboardUseCases";
import { IDashboardRepository } from "@domain/repositories/IDashboardRepository";
import { DateUtil } from "@shared/utils/dateUtil";
import { DateFilter } from "@application/dtos/DashboardDTO";
import { IDateFilter, ITopCategory, ITopPackage,IBookingsChartData } from "@application/dtos/DashboardDTO";


export class DashboardUseCases implements IDashboardUseCases {
  constructor(private readonly _dashboardRepo: IDashboardRepository) { }

  async getDashboardSummary(filter?: IDateFilter): Promise<IDashboardSummary> {
    const { startDate, endDate } = DateUtil.getDateRange(
      filter?.filter,
      filter?.startDate,
      filter?.endDate
    )
    const [totalUsers, totalPackages, totalBookings, totalCustomPlans, totalBlogs] =
      await Promise.all([
        this._dashboardRepo.getTotalUsers(startDate, endDate),
        this._dashboardRepo.getTotalPackages(startDate, endDate),
        this._dashboardRepo.getTotalBookings(startDate, endDate),
        this._dashboardRepo.getTotalCustomPlans(startDate, endDate),
        this._dashboardRepo.getTotalBlogs(startDate, endDate),
      ])

    return {
      totalUsers,
      totalPackages,
      totalBookings,
      totalCustomPlans,
      totalBlogs,
    }
  }


  async getTopBookedPackages(filter?: IDateFilter): Promise<ITopPackage[]> {
    const {startDate,endDate}=DateUtil.getDateRange(
      filter?.filter,
      filter?.startDate,
      filter?.endDate
    )

    return await this._dashboardRepo.getTopBookedPackages(startDate,endDate)

  }

  async getTopBookedCategories(filter?: IDateFilter): Promise<ITopCategory[]> {
     const {startDate,endDate}=DateUtil.getDateRange(
      filter?.filter,
      filter?.startDate,
      filter?.endDate
    )

    return await this._dashboardRepo.getTopBookedCategories(startDate,endDate)

  }

  
  async getBookingsChartData(dateFilter: IDateFilter):Promise<IBookingsChartData[]> {
    const { startDate, endDate, groupBy } = DateUtil.getDateRangeAndGroupBy(dateFilter);
    return await this._dashboardRepo.getBookingsChartData(startDate, endDate, groupBy);
  }


}