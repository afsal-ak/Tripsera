
export interface IDashboardSummary {
  totalUsers: number;
  totalBookings: number;
  totalPackages: number;
  totalCustomPlans: number;
  totalBlogs: number;
}

export interface ITopPackage {
  packageId: string;
  packageName: string;
  packageImage: string;
  totalRevenue?: number;
  totalBookings: number;
}

export const mapToTopPkgResponseDTO = (topPkg: ITopPackage): ITopPackage => {
  return {
    packageId: topPkg.packageId,
    packageName: topPkg.packageName,
    packageImage: topPkg.packageImage,
    totalRevenue:topPkg.totalRevenue,
    totalBookings: topPkg.totalBookings,
  }
}



export interface ITopCategory {
  categoryId: string,
  name: string;
  totalBookings: number;
}

export const mapToTopCategoryResponseDTO = (topCat: ITopCategory): ITopCategory => {
  return {
    categoryId: topCat.categoryId,
    name: topCat.name,
    totalBookings: topCat.totalBookings,
  }
}

export type DateFilter = "today" | "this_week" | "this_month" | "this_year" | "custom";

export interface IDateFilter {
  filter?: DateFilter;
  startDate?: string;
  endDate?: string;
}
 export interface IDateRangeResult {
  startDate: Date;
  endDate: Date;
  groupBy: "hour" | "day" | "month" | "year";
}

export interface IBookingsChartData {
  _id: string;          // e.g. "01 Aug" or "Aug 2025" or "2025"
  totalBookings: number; // total confirmed bookings
  totalRevenue:number
}


export const mapToBookingChartResponseDTO = (chart: IBookingsChartData): IBookingsChartData => {
  return {
    _id: chart._id,
    totalBookings: chart.totalBookings,
    totalRevenue: chart.totalRevenue,
  }
}
