import api from '@/lib/axios/api';
import type { CouponFormSchema } from '@/schemas/CouponFormSchema';

export const fetchCouponData = async (page: number, limit: number) => {
  const response = await api.get(`/admin/coupons?page=${page}&limit=${limit}`);
  console.log(response.data, 'coupons');
  return response.data;
};

export const createCoupon = async (couponData: CouponFormSchema) => {
  const response = await api.post('/admin/coupon/add', couponData);
  return response.data;
};

export const getCouponById = async (id: string) => {
  const response = await api.get(`/admin/coupon/${id}`);
  return response.data;
};

export const editCoupon = async (id: string, couponData: Partial<CouponFormSchema>) => {
  const response = await api.put(`/admin/coupon/edit/${id}`, couponData);
  return response.data;
};

export const changeCouponStatus = async (id: string, body: { isActive: boolean }) => {
  const response = await api.patch(`/admin/coupon/status/${id}`, body);
  return response.data;
};
