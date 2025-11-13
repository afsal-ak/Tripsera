import { ITopPackage, ITopCategory, IBookingsChartData, IHomeTopPackage } from '@application/dtos/DashboardDTO';

export interface IDashboardRepository {
  getTotalUsers(startDate?: Date, endDate?: Date): Promise<number>;
  getTotalPackages(startDate?: Date, endDate?: Date): Promise<number>;
  getTotalBookings(startDate?: Date, endDate?: Date): Promise<number>;
  getTotalCustomPlans(startDate?: Date, endDate?: Date): Promise<number>;
  getTotalBlogs(startDate?: Date, endDate?: Date): Promise<number>;
  getTopBookedPackages(startDate?: Date, endDate?: Date): Promise<ITopPackage[]>;
  getTopBookedCategories(startDate?: Date, endDate?: Date): Promise<ITopCategory[]>;
  getBookingsChartData(
    startDate?: Date,
    endDate?: Date,
    groupBy?: 'hour' | 'day' | 'month' | 'year'
  ): Promise<IBookingsChartData[]>;

   getTopBookedPackagesForUser(limit?: number): Promise<IHomeTopPackage[]>;
  getTopBookedCategoriesForUser(limit?: number): Promise<ITopCategory[]>;
}
