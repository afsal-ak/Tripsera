import api from '@/lib/axios/api';

export const fetchAdminNotification = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const response = await api.get('/admin/notification', { params });
  console.log(response,'noitigc');
  
  return response.data;
};

export const adminMarkNotificationAsRead = async (id: string) => {
  const response = await api.patch(`/admin/mark-read/${id}`);
  return response.data;
};
