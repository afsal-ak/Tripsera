import api from '@/lib/axios/api';
import type { CustomPkgFormSchema, EditCustomPkgFormSchema } from '@/schemas/customPkgSchema';

export const getAllCustomPkg = async (page: number, limit: number) => {
  const response = await api.get(`/user/custom-package?page=${page}&limit=${limit}`);
  console.log(response.data, 'cutm pkg 1');

  return response.data.data;
};
export const getCustomPkgById = async (packageId: string) => {
  const response = await api.get(`/user/custom-package/${packageId}`);
  return response.data;
};

export const createCustomPkg = async (data: CustomPkgFormSchema) => {
  const response = await api.post(`/user/custom-package/create`, data);
  return response;
};

export const updateCustomPkg = async (
  packageId: string,
  data: Partial<EditCustomPkgFormSchema>
) => {
  const response = await api.put(`/user/custom-package/${packageId}/edit`, data);
  return response.data;
};

export const deleteCustomPkg = async (packageId: string) => {
  const response = await api.delete(`/user/custom-package/${packageId}/delete`);
  return response.data;
};


export const fetchUserCustomPackages = async (
  page: number ,
  limit: number 
)=> {
  const res = await api.get('/user/custom-packages/user', {
    params: { page, limit },
  });

  return res.data;
};