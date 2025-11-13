// // import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
// // import { HttpStatus } from '@/Constants/HttpStatus/HttpStatus';
// // import { toast } from 'sonner';

// // // Extend Axios config to include _retry
// // declare module 'axios' {
// //   export interface AxiosRequestConfig {
// //     _retry?: boolean;
// //   }
// // }

// // const api = axios.create({
// //   baseURL: import.meta.env.VITE_API_BASE_URL,
// //   withCredentials: true,
// // });

// // // Helper: get correct token based on URL
// // function getTokenForUrl(url: string): string | null {
// //   if (url.startsWith('/user')) {
// //     return localStorage.getItem('accessToken');
// //   }
// //   if (url.startsWith('/admin')) {
// //     return localStorage.getItem('adminAccessToken');
// //   }
// //   return null;
// // }

// // // Helper: get login & refresh endpoints
// // function getAuthEndpoints(url: string) {
// //   const isUser = url.startsWith('/user');
// //   return {
// //     tokenKey: isUser ? 'accessToken' : 'adminAccessToken',
// //     refreshEndpoint: isUser ? '/user/refresh-token' : '/admin/refresh-token',
// //     isUser,
// //   };
// // }


// // // Request interceptor

// // api.interceptors.request.use(
// //   (config) => {
// //     const url = config.url ?? '';
// //     const token = getTokenForUrl(url);
// //     if (token) {
// //       config.headers = config.headers || {};
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );


// // // Response interceptor

// // // api.interceptors.response.use(
// // //   (response) => response,
// // //   async (error: AxiosError) => {
// // //     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
// // //     const status = error.response?.status;
// // //     const message = (error.response?.data as any)?.message ?? '';
// // //     const url = originalRequest.url ?? '';

// // //     //  Handle blocked user
// // //     if (
// // //       url.startsWith('/user') &&
// // //       status === HttpStatus.FORBIDDEN &&
// // //       message.toLowerCase().includes('blocked')
// // //     ) {
// // //       localStorage.removeItem('accessToken');
// // //       toast.error('You have been blocked by the admin.');
// // //       return Promise.reject(error);
// // //     }

// // //     //  Handle token refresh
// // //     if (
// // //       status === HttpStatus.UNAUTHORIZED &&
// // //       !originalRequest._retry &&
// // //       !url.includes('/login') &&
// // //       !url.includes('/refresh-token')
// // //     ) {
// // //       originalRequest._retry = true;

// // //       const { tokenKey, refreshEndpoint } = getAuthEndpoints(url);

// // //       try {
// // //         const res = await axios.post(
// // //           `${import.meta.env.VITE_API_BASE_URL}${refreshEndpoint}`,
// // //           {},
// // //           { withCredentials: true }
// // //         );

// // //         const { accessToken } = res.data as { accessToken: string };
// // //         if (!accessToken) throw new Error('No access token received');

// // //         localStorage.setItem(tokenKey, accessToken);
// // //         originalRequest.headers = originalRequest.headers || {};
// // //         originalRequest.headers.Authorization = `Bearer ${accessToken}`;

// // //         return api(originalRequest);
// // //       } catch (refreshError) {
// // //         localStorage.removeItem(tokenKey);
// // //         // No redirect here; let your ProtectedRoute handle it
// // //         console.warn('Session expired — ProtectedRoute will handle redirect.');
// // //         return Promise.reject(refreshError);
// // //       }
// // //     }

// // //     return Promise.reject(error);
// // //   }
// // // );
// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error: AxiosError) => {
// //     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
// //     const status = error.response?.status;
// //     const message = (error.response?.data as any)?.message ?? '';
// //     const url = originalRequest.url ?? '';

// //     // Handle blocked user
// //     if (
// //       url.startsWith('/user') &&
// //       status === HttpStatus.FORBIDDEN &&
// //       message.toLowerCase().includes('blocked')
// //     ) {
// //       toast.error('You have been blocked by the admin.');

// //       localStorage.removeItem('accessToken');
// //       localStorage.removeItem('user');

// //       // Redirect to login
// //       setTimeout(() => (window.location.href = "/login"), 1000);
// //       return Promise.reject(error);
// //     }

// //     // Handle token refresh
// //     if (
// //       status === HttpStatus.UNAUTHORIZED &&
// //       !originalRequest._retry &&
// //       !url.includes('/login') &&
// //       !url.includes('/refresh-token') &&
// //       !url.includes('/home')// &&
// //    //   !url.includes('/refresh-token')
// //     ) {
// //       originalRequest._retry = true;

// //       const { tokenKey, refreshEndpoint } = getAuthEndpoints(url);

// //       try {
// //         const res = await axios.post(
// //           `${import.meta.env.VITE_API_BASE_URL}${refreshEndpoint}`,
// //           {},
// //           { withCredentials: true }
// //         );

// //         const { accessToken } = res.data as { accessToken: string };
// //         if (!accessToken) throw new Error('No access token received');

// //         localStorage.setItem(tokenKey, accessToken);
// //         originalRequest.headers = originalRequest.headers || {};
// //         originalRequest.headers.Authorization = `Bearer ${accessToken}`;

// //         return api(originalRequest);
// //       } catch (refreshError) {
// //         localStorage.removeItem(tokenKey);
// //         toast.error('Session expired. Please login again.');

// //         // Redirect to login
// //       setTimeout(() => (window.location.href = "/login"), 1000);
// //         return Promise.reject(refreshError);
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// // export default api;
// import axios from "axios";
// import { toast } from "sonner";
// // Create Axios instance
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
//   withCredentials: true, // if your backend uses cookies
//   headers: { "Content-Type": "application/json" },
// });

// // 🧠 Request Interceptor — attach token automatically
// api.interceptors.request.use(
//   (config) => {
//     const userToken = localStorage.getItem("accessToken");
//     const adminToken = localStorage.getItem("adminAccessToken");

//     // Check if request is admin or user
//     if (config.url?.startsWith("/admin")) {
//       if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
//     } else if (config.url?.startsWith("/user")) {
//       if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🚨 Response Interceptor — handle expired sessions or guest access
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error?.response?.status;
//     const url = originalRequest?.url || "";

//     const isUserRoute = url.startsWith("/user");
//     const isAdminRoute = url.startsWith("/admin");

//     const userToken = localStorage.getItem("accessToken");
//     const adminToken = localStorage.getItem("adminAccessToken");

//     // 🚫 Guest user trying to call /user routes (like unread count)
//     if (status === 401 && isUserRoute && !userToken) {
//       // Just ignore, no redirect or toast
//       return Promise.reject(error);
//     }

//     // 🧑‍💼 Admin token expired
//     if (status === 401 && isAdminRoute && adminToken) {
//       toast.error("Admin session expired. Please login again.");
//       localStorage.removeItem("adminAccessToken");
//       window.location.href = "/admin/login";
//       return Promise.reject(error);
//     }

//     // 👤 User token expired
//     if (status === 401 && isUserRoute && userToken) {
//       toast.error("Session expired. Please login again.");
//       localStorage.removeItem("accessToken");
//       window.location.href = "/login";
//       return Promise.reject(error);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import { HttpStatus } from "@/Constants/HttpStatus/HttpStatus";
import axios, { AxiosError,type AxiosRequestConfig } from "axios";
import { toast } from "sonner";

// Add retry flag to Axios config
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

// Base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// --- Helpers ---
function getAuthType(url: string) {
  const isUser = url.startsWith("/user");
  const isAdmin = url.startsWith("/admin");
  return { isUser, isAdmin };
}

function getTokenKey(url: string) {
  const { isUser } = getAuthType(url);
  return isUser ? "accessToken" : "adminAccessToken";
}

function getRefreshEndpoint(url: string) {
  const { isUser } = getAuthType(url);
  return isUser ? "/user/refresh-token" : "/admin/refresh-token";
}

// --- Request interceptor ---
api.interceptors.request.use(
  (config) => {
    const url = config.url ?? "";
    const tokenKey = getTokenKey(url);
    const token = localStorage.getItem(tokenKey);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message ?? "";
    const url = originalRequest.url ?? "";

    const { isUser, isAdmin } = getAuthType(url);
    const tokenKey = getTokenKey(url);
    const refreshEndpoint = getRefreshEndpoint(url);

    //  Blocked user
    if (
      isUser &&
      status === HttpStatus.FORBIDDEN &&
      message.toLowerCase().includes("blocked")
    ) {
      toast.error("You have been blocked by the admin.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setTimeout(() => (window.location.href = "/login"), 1200);
      return Promise.reject(error);
    }

    //   Guest user (no redirect)
    if (isUser && status === HttpStatus.UNAUTHORIZED && !localStorage.getItem("accessToken")) {
      // Just reject silently (guest case)
      return Promise.reject(error);
    }

    //   Token refresh (user or admin)
    if (
      status === HttpStatus.UNAUTHORIZED &&
      !originalRequest._retry &&
      !url.includes("/login") &&
      !url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${refreshEndpoint}`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data as { accessToken: string };
        if (!accessToken) throw new Error("No new token received");

        // Save new token and retry
        localStorage.setItem(tokenKey, accessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(tokenKey);

        if (isUser) {
          toast.error("Session expired. Please login again.");
          setTimeout(() => (window.location.href = "/login"), 1000);
        } else if (isAdmin) {
          toast.error("Admin session expired. Please login again.");
          setTimeout(() => (window.location.href = "/admin/login"), 1000);
        }

        return Promise.reject(refreshError);
      }
    }

    //  Generic error handling
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) toast.error("Something went wrong on the server.");
    if (status === HttpStatus.NOT_FOUND) toast.error("Requested resource not found.");

    return Promise.reject(error);
  }
);

export default api;
