import api from '@/lib/axios/api';
export const handleAdminLogin = async (email: string, password: string) => {
  try {
    const res = await api.post('/admin/admin-login', { email, password });

    if (!res.data?.admin || !res.data?.accessToken) {
      throw new Error('Invalid response format');
    }

    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Login failed';
    throw new Error(message);
  }
};

export const handleAdminLogout = async (): Promise<void> => {
  try {
    await api.post('/admin/logout', {}, { withCredentials: true });
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Logout failed');
  }
};

export const refreshToken = async () => {
  const res = await api.post('/admin/refreshToken');
  return res.data;
};
