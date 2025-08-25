import api from "@/lib/axios/api";
import type {
  IDateFilter,
  IDashboardSummary,
  ITopPackage,
  ITopCategory,
  IBookingsChartPoint,
} from "@/types/IDashboard";

export const handleSummary=async(filter?: IDateFilter)=>{
    const response=await api.get('/admin/dashboard/summary', { params: filter })
    return response.data
}


export const handleTopPackage=async(filter?: IDateFilter)=>{
    const response=await api.get('/admin/dashboard/top-packages', { params: filter })
    return response.data
}

export const handleTopCategory=async(filter?: IDateFilter)=>{
    const response=await api.get('/admin/dashboard/top-category', { params: filter })
    return response.data
}

export const handleBookingChart=async(filter?: IDateFilter)=>{
    const response=await api.get('/admin/dashboard/booking-chart', { params: filter })
    return response.data
}




// export const DASHBOARD_ROUTE = {
//    GET_DASHBOARD_SUMMARY: '/dashboard/summary',
//    GET_TOP_PACKAGES: '/dashboard/top-packages',
//    GET_TOP_CATEGORIES: '/dashboard/top-category',
//    GET_BOOKING_CHART: '/dashboard/booking-chart',
//  };
 