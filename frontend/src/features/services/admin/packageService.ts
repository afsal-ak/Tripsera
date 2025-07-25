import adminApi from '@/lib/axios/adminAxios';

export const addPackage = async (formData: FormData) => {
  const response = await adminApi.post('/addPackage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchPackagesData = async (page: number, limit: number) => {
  const response = await adminApi.get(`/packages?page=${page}&limit=${limit}`);
  return response.data;
};

export const blockPackage = async (id: string) => {
  const response = await adminApi.patch(`/packages/${id}/block`);
  return response;
};
export const unBlockPackage = async (id: string) => {
  const response = await adminApi.patch(`/packages/${id}/unblock`);
  return response;
};

export const getPackageById = async (id: string) => {
  const response = await adminApi.get(`/packages/${id}`);
  console.log(response.data?.packages, 'd');
  return response.data.packages;
};

export const updatePackage = async (id: string, formData: FormData) => {
  try {
    const response = await adminApi.put(`/packages/${id}/edit`, formData, {
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
  const response = await adminApi.get('/category/active');
  return response.data;
};
