import api from '@/lib/axios/api';

export const getAllActiveCoupon = async (page: number, limit: number) => {
  const response = await api.get(`/user/coupons?page=${page}&limit=${limit}`);
  return response.data;
};
