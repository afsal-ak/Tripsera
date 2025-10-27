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

export const fetchAllApprovedCustomPkg = async (page: number, limit: number, filter: IFilter) => {
  const params = {
    page,
    limit,
    ...filter,
  };
  const response = await api.get(`/admin/custom-package/approved`, { params });
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


//for admin to add pacakge for users

export const addPackageForUser = async (formData: FormData) => {
  const response = await api.post('/admin/custom-package/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

 
//for admin to update pacakge
export const updatePackageForUser = async (id: string, formData: FormData) => {
  try {
    const response = await api.put(`/admin/custom-package/edit/${id}`, formData, {
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

// export const updateCustomPkgData = async (packageId: string, status: string, adminResponse: string) => {
//   const data = {
//     status,
//     adminResponse,
//   };
//   const response = await api.put(`/admin/custom-package/edit/${packageId}`,);
//   return response.data;
// };