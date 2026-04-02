import {
  ITopPackage,
  ITopCategory,
  IBookingsChartData,
  IHomeTopPackage
} from '@application/dtos/DashboardDTO';

export interface IDashboardRepository {

  getTotalUsers(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number>;

  getTotalPackages(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number>;

  getTotalBookings(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number>;

  getTotalCustomPlans(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number>;

  getTotalBlogs(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number>;

  getTopBookedPackages(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<ITopPackage[]>;

  getTopBookedCategories(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<ITopCategory[]>;

  getBookingsChartData(
    startDate?: Date,
    endDate?: Date,
    groupBy?: 'hour' | 'day' | 'month' | 'year',
    companyId?: string
  ): Promise<IBookingsChartData[]>;

  // 🔥 USER SIDE (NO companyId needed)
  getTopBookedPackagesForUser(limit?: number): Promise<IHomeTopPackage[]>;

  getTopBookedCategoriesForUser(limit?: number): Promise<ITopCategory[]>;
}
// import { ITopPackage, ITopCategory, IBookingsChartData, IHomeTopPackage } from '@application/dtos/DashboardDTO';

// export interface IDashboardRepository {
//   getTotalUsers(startDate?: Date, endDate?: Date): Promise<number>;
//   getTotalPackages(startDate?: Date, endDate?: Date): Promise<number>;
//   getTotalBookings(startDate?: Date, endDate?: Date): Promise<number>;
//   getTotalCustomPlans(startDate?: Date, endDate?: Date): Promise<number>;
//   getTotalBlogs(startDate?: Date, endDate?: Date): Promise<number>;
//   getTopBookedPackages(startDate?: Date, endDate?: Date): Promise<ITopPackage[]>;
//   getTopBookedCategories(startDate?: Date, endDate?: Date): Promise<ITopCategory[]>;
//   getBookingsChartData(
//     startDate?: Date,
//     endDate?: Date,
//     groupBy?: 'hour' | 'day' | 'month' | 'year'
//   ): Promise<IBookingsChartData[]>;

//    getTopBookedPackagesForUser(limit?: number): Promise<IHomeTopPackage[]>;
//   getTopBookedCategoriesForUser(limit?: number): Promise<ITopCategory[]>;
// }
