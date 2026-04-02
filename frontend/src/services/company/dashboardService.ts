import api from '@/lib/axios/api';
import type { IDateFilter } from '@/types/IDashboard';

export const handleSummary = async (filter?: IDateFilter) => {
  const response = await api.get('/company/dashboard/summary', { params: filter });
  return response.data;
};

export const handleTopPackage = async (filter?: IDateFilter) => {
  const response = await api.get('/company/dashboard/top-packages', { params: filter });
  return response.data;
};

export const handleTopCategory = async (filter?: IDateFilter) => {
  const response = await api.get('/company/dashboard/top-category', { params: filter });
  return response.data;
};

export const handleBookingChart = async (filter?: IDateFilter) => {
  const response = await api.get('/company/dashboard/booking-chart', { params: filter });
  return response.data;
};
