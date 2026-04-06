import api from '@/lib/axios/api';

export const fetchCompanyNotification = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const response = await api.get('/company/notification', { params });
  // console.log(response,'noitigc');
  
  return response.data;
};

export const companyMarkNotificationAsRead = async (id: string) => {
  const response = await api.patch(`/company/mark-read/${id}`);
  return response.data;
};
