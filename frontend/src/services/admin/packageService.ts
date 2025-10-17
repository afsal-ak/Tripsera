import api from "@/lib/axios/api";
import type{ IFilter } from "@/types/IFilter";


export const addPackage = async (formData: FormData) => {
  const response = await api.post('/admin/addPackage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchPackagesData = async (
  page: number,
  limit: number,
  filter: IFilter
) => {
  const params = {
    page,
    limit,
    ...filter,
  };

  const response = await api.get(`/admin/packages`,{ params });
  console.log(response.data.data,'i service ');
  
  return response.data.data;
};

export const blockPackage = async (id: string) => {
  const response = await api.patch(`/admin/packages/${id}/block`);
  return response;
};
export const unBlockPackage = async (id: string) => {
  const response = await api.patch(`/admin/packages/${id}/unblock`);
  return response;
};

export const getPackageById = async (id: string) => {
  const response = await api.get(`/admin/packages/${id}`);
  console.log(response.data?.packages, 'd');
  return response.data.packages;
};

export const updatePackage = async (id: string, formData: FormData) => {
  try {
    const response = await api.put(`/admin/packages/${id}/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || 'Something went wrong while updating the package.';
    throw new Error(message);
  }
};

export const getCategory = async () => {
  const response = await api.get('/admin/category/active');
  return response.data;
};
