import api from '@/lib/axios/api';
import type { IFilter } from '@/types/IFilter';

export const getAllCustomPkg = async (page: number, limit: number, filter: IFilter) => {
  const params = {
    page,
    limit,
    ...filter,
  };
  const response = await api.get(`/admin/custom-package`, { params });
  console.log(response.data, 'jjj');

  return response.data.data;
};
export const getCustomPkgById = async (packageId: string) => {
  const response = await api.get(`/admin/custom-package/${packageId}`);
  return response.data;
};

export const updateCustomPkg = async (packageId: string, status: string, adminResponse: string) => {
  const data = {
    status,
    adminResponse,
  };
  const response = await api.put(`/admin/custom-package/${packageId}/edit`, data);
  return response.data;
};

export const deleteCustomPkg = async (packageId: string) => {
  const response = await api.delete(`/admin/custom-package/${packageId}/delete`);
  return response.data;
};
