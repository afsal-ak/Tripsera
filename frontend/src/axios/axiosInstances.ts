import axios from "axios";
import type { AxiosInstance } from "axios"; 

// Create a custom Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/admin",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for attaching auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
     // console.warn("Unauthorized - maybe redirect to login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
