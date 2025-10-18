import api from '@/lib/axios/api';
import type { ICreateReport } from '@/types/IReport';

export const createReport = async (id: string, report: ICreateReport) => {
  const response = await api.post(`/user/report/${id}`, report);
  return response.data;
};
