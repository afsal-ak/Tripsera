import { ITopPackage, ITopCategory,IBookingsChartData } from "@application/dtos/DashboardDTO";

// export interface IDashboardRepository {
//   getTotalUsers(): Promise<number>;
//   getTotalPackages(): Promise<number>;
//   getTotalBookings(): Promise<number>;
//   getTotalCustomPlans(): Promise<number>;
//   getTotalBlogs(): Promise<number>;
//    getTopPackages(): Promise<ITopPackage[]>; 

// }
export interface IDashboardRepository {
  getTotalUsers(startDate?: Date, endDate?: Date): Promise<number>;
  getTotalPackages(startDate?: Date, endDate?: Date): Promise<number>;
  getTotalBookings(startDate?: Date, endDate?: Date): Promise<number>;
  getTotalCustomPlans(startDate?: Date, endDate?: Date): Promise<number>;
  getTotalBlogs(startDate?: Date, endDate?: Date): Promise<number>;
  getTopBookedPackages(startDate?: Date, endDate?: Date): Promise<ITopPackage[]>;
//  getTopCategory(startDate?: Date, endDate?: Date): Promise<ITopCategory[]>;
  getTopBookedCategories(startDate?: Date, endDate?: Date): Promise<ITopCategory[]>;
  getBookingsChartData(
    startDate?: Date,
    endDate?: Date,
    groupBy?: "hour"|"day" | "month" | "year"
  ): Promise<IBookingsChartData[]>;
 
}
