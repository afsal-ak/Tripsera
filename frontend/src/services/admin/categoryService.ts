import api from '@/lib/axios/api';

export const fetchCategoriesData = async (
  page: number,
  limit: number,
  search: string,
  status: string
) => {
  const params = {
    page,
    limit,
    search,
    status,
  };
  const response = await api.get(`/admin/categories`, { params });
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await api.get(`/admin/category/${id}`);
  return response.data;
};

export const createCategory = async (data: { name: string; isBlocked: boolean }) => {
  const response = await api.post('/admin/addCategory', data);
  return response.data;
};

export const updateCategory = async (id: string, data: { name: string; isBlocked: boolean }) => {
  const response = await api.put(`/admin/category/${id}`, data);
  return response.data;
};

export const blockCategory = async (id: string) => {
  try {
    const response = await api.patch(`/admin/category/${id}/block`);

    return response.data;
  } catch (error) {
    console.error('Failed to block category', error);
  }
};
export const unBlockCategory = async (id: string) => {
  try {
    const response = await api.patch(`/admin/category/${id}/unblock`);

    return response.data;
  } catch (error) {
    console.error('Failed to unblock category', error);
  }
};
