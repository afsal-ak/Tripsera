export type DateFilter = 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom';

export interface IDateFilter {
  filter?: DateFilter;
  startDate?: string; // ISO yyyy-mm-dd
  endDate?: string; // ISO yyyy-mm-dd
}

export interface IDashboardSummary {
  totalUsers: number;
  totalPackages: number;
  totalBookings: number;
  totalCustomPlans: number;
  totalBlogs: number;
}

export interface ITopPackage {
  packageId: string;
  packageName: string;
  packageImage?: string;
  totalBookings: number;
  totalRevenue: number;
}

export interface ITopCategory {
  categoryId: string;
  name: string;
  totalBookings: number;
}

export interface IBookingsChartPoint {
  _id: string | { day?: number; month?: number; year: number };
  totalBookings: number;
  totalRevenue: number;
}
