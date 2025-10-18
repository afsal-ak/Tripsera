import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
import { HttpStatus } from '@/Constants/HttpStatus/HttpStatus';
import { toast } from 'sonner';

// Extend Axios config to include _retry
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Helper: get correct token based on URL
function getTokenForUrl(url: string): string | null {
  if (url.startsWith('/user')) {
    return localStorage.getItem('accessToken');
  }
  if (url.startsWith('/admin')) {
    return localStorage.getItem('adminAccessToken');
  }
  return null;
}

// Helper: get login & refresh endpoints
function getAuthEndpoints(url: string) {
  const isUser = url.startsWith('/user');
  return {
    tokenKey: isUser ? 'accessToken' : 'adminAccessToken',
    refreshEndpoint: isUser ? '/user/refresh-token' : '/admin/refresh-token',
    loginUrl: isUser ? '/login' : '/admin/login',
    isUser,
  };
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const url = config.url ?? '';
    const token = getTokenForUrl(url);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message ?? '';
    const url = originalRequest.url ?? '';

    //   blocked user
    if (
      url.startsWith('/user') &&
      status === HttpStatus.FORBIDDEN &&
      message.toLowerCase().includes('blocked')
    ) {
      localStorage.removeItem('accessToken');
      toast.error('You have been blocked by the admin');
      setTimeout(() => (window.location.href = '/login'), 1000);
      return Promise.reject(error);
    }

    // Handle refresh token for both
    if (
      status === HttpStatus.UNAUTHORIZED &&
      !originalRequest._retry &&
      !url.includes('/login') &&
      !url.includes('/refresh-token')
    ) {
      originalRequest._retry = true;

      const { tokenKey, refreshEndpoint, loginUrl } = getAuthEndpoints(url);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${refreshEndpoint}`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data as { accessToken: string };
        if (!accessToken) throw new Error('No access token received');

        localStorage.setItem(tokenKey, accessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(tokenKey);
        toast.error('Session expired. Please log in again.');
        setTimeout(() => (window.location.href = loginUrl), 1000);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
