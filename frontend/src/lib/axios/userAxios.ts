import axios from 'axios';
import { logout } from '@/redux/slices/userAuthSlice';
import { store } from '@/redux/store';
import { toast } from 'sonner';
const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/user',
  withCredentials: true,
});

//  Attach access token to every request
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Access Token:', token);

    return config;
  },
  (error) => Promise.reject(error)
);

//  Response interceptor: Auto refresh token on 401
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const message = error.response?.data?.message;

    const state = store.getState(); //  get latest auth state
    const isAuthenticated = state.userAuth.isAuthenticated;

    //  If user is blocked, log them out
    if (status === 403 && message?.toLowerCase().includes('blocked')) {
      store.dispatch(logout());
      toast.error('You have been blocked by the admin ');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return Promise.reject(error);
    }

    // Check if token expired and retry is not already attempted

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/user/login') &&
      !originalRequest.url.includes('/user/refresh-token') &&
      isAuthenticated
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/user/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return userApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        return Promise.reject(refreshError);
      }
    }

    // Log and forward error
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default userApi;
