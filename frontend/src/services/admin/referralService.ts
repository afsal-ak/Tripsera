import api from '@/lib/axios/api';
import type { IReferral } from '@/types/IReferral';

export const getReferral = async () => {
  const res = await api.get('/admin/referral');
  return res.data;
};

export const createReferral = async (data: Partial<IReferral>): Promise<IReferral> => {
  const res = await api.post('/admin/referral/add', data);
  return res.data.referral;
};

export const updateReferral = async (id: string, data: Partial<IReferral>): Promise<IReferral> => {
  const res = await api.put(`/admin/referral/${id}`, data);
  return res.data;
};
