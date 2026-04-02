import { HttpStatus } from "@/Constants/HttpStatus/HttpStatus";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { warning } from "framer-motion";
import { enqueueSnackbar } from "notistack";

// Extend Axios config
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ---------------- HELPERS ----------------

// detect request type
function getAuthType(url: string) {
  const isUser = url.startsWith("/user");
  const isAdmin = url.startsWith("/admin");
  const isCompany = url.startsWith("/company");

  return { isUser, isAdmin, isCompany };
}

// token key
function getTokenKey(url: string) {
  const { isUser, isCompany } = getAuthType(url);

  if (isUser) return "accessToken";
  if (isCompany) return "companyAccessToken";

  return "adminAccessToken";
}

// refresh endpoint
function getRefreshEndpoint(url: string) {
  const { isUser, isCompany } = getAuthType(url);

  if (isUser) return "/user/refresh-token";
  if (isCompany) return "/company/refresh-token";

  return "/admin/refresh-token";
}

// ---------------- REQUEST INTERCEPTOR ----------------

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

// ---------------- RESPONSE INTERCEPTOR ----------------

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message ?? "";
    const url = originalRequest.url ?? "";

    const { isUser, isAdmin, isCompany } = getAuthType(url);
    const tokenKey = getTokenKey(url);
    const refreshEndpoint = getRefreshEndpoint(url);

    // ---------------- BLOCKED USER ----------------
    if (
      (isUser || isCompany) &&
      status === HttpStatus.FORBIDDEN &&
      message.toLowerCase().includes("blocked")
    ) {
      enqueueSnackbar("You have been blocked by the admin.",{variant:'error'});

      localStorage.removeItem(tokenKey);

      if (isUser) {
        localStorage.removeItem("user");
        setTimeout(() => (window.location.href = "/login"), 1200);
      }

      if (isCompany) {
        localStorage.removeItem("company");
        setTimeout(() => (window.location.href = "/company/login"), 1200);
      }

      return Promise.reject(error);
    }

    // ---------------- GUEST USER ----------------
    if (isUser && status === HttpStatus.UNAUTHORIZED && !localStorage.getItem("accessToken")) {
      return Promise.reject(error);
    }

    // ---------------- TOKEN REFRESH ----------------
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

        // save new token
        localStorage.setItem(tokenKey, accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(tokenKey);

        if (isUser) {
          enqueueSnackbar("Session expired. Please login again.", {  variant: "error",});
          setTimeout(() => (window.location.href = "/login"), 1000);
        } else if (isAdmin) {
          enqueueSnackbar("Admin session expired. Please login again.", {
            variant: "error",
          }); setTimeout(() => (window.location.href = "/admin/login"), 1000);
        }

        if (isCompany) {
             enqueueSnackbar("Company session expired. Please login again.", {
            variant: "error",
          });
          // toast.error("Company session expired.");
           setTimeout(() => (window.location.href = "/company/login"), 1000);
        }

        return Promise.reject(refreshError);
      }
    }

    //  Generic error handling
    if (message) {
      // toast.error(message);
    }
    //  Generic fallback
    else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      enqueueSnackbar("Something went wrong on the server.",{variant:'error'});
    } else if (status === HttpStatus.NOT_FOUND) {
      enqueueSnackbar("Requested resource not found.",{variant:'error'});
    }
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) toast.error("Something went wrong on the server.");
    // if (status === HttpStatus.NOT_FOUND) toast.error("Requested resource not found.");

    return Promise.reject(error);
  }
);

export default api;



// import { HttpStatus } from "@/Constants/HttpStatus/HttpStatus";
// import axios, { AxiosError,type AxiosRequestConfig } from "axios";
// import { toast } from "sonner";

// // Add retry flag to Axios config
// declare module "axios" {
//   export interface AxiosRequestConfig {
//     _retry?: boolean;
//   }
// }

// // Base instance
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true,
// });

// // --- Helpers ---
// function getAuthType(url: string) {
//   const isUser = url.startsWith("/user");
//   const isAdmin = url.startsWith("/admin");
//   return { isUser, isAdmin };
// }

// function getTokenKey(url: string) {
//   const { isUser } = getAuthType(url);
//   return isUser ? "accessToken" : "adminAccessToken";
// }

// function getRefreshEndpoint(url: string) {
//   const { isUser } = getAuthType(url);
//   return isUser ? "/user/refresh-token" : "/admin/refresh-token";
// }

// // --- Request interceptor ---
// api.interceptors.request.use(
//   (config) => {
//     const url = config.url ?? "";
//     const tokenKey = getTokenKey(url);
//     const token = localStorage.getItem(tokenKey);

//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // --- Response interceptor ---
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
//     const status = error.response?.status;
//     const message = (error.response?.data as any)?.message ?? "";
//     const url = originalRequest.url ?? "";

//     const { isUser, isAdmin } = getAuthType(url);
//     const tokenKey = getTokenKey(url);
//     const refreshEndpoint = getRefreshEndpoint(url);

//     //  Blocked user
//     if (
//       isUser &&
//       status === HttpStatus.FORBIDDEN &&
//       message.toLowerCase().includes("blocked")
//     ) {
//       toast.error("You have been blocked by the admin.");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("user");
//       setTimeout(() => (window.location.href = "/login"), 1200);
//       return Promise.reject(error);
//     }

//     //   Guest user (no redirect)
//     if (isUser && status === HttpStatus.UNAUTHORIZED && !localStorage.getItem("accessToken")) {
//       // Just reject silently (guest case)
//       return Promise.reject(error);
//     }

//     //   Token refresh (user or admin)
//     if (
//       status === HttpStatus.UNAUTHORIZED &&
//       !originalRequest._retry &&
//       !url.includes("/login") &&
//       !url.includes("/refresh-token")
//     ) {
//       originalRequest._retry = true;

//       try {
//         const res = await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}${refreshEndpoint}`,
//           {},
//           { withCredentials: true }
//         );

//         const { accessToken } = res.data as { accessToken: string };
//         if (!accessToken) throw new Error("No new token received");

//         // Save new token and retry
//         localStorage.setItem(tokenKey, accessToken);
//         originalRequest.headers = originalRequest.headers || {};
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//         return api(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem(tokenKey);

//         if (isUser) {
//           toast.error("Session expired. Please login again.");
//           setTimeout(() => (window.location.href = "/login"), 1000);
//         } else if (isAdmin) {
//           toast.error("Admin session expired. Please login again.");
//           setTimeout(() => (window.location.href = "/admin/login"), 1000);
//         }

//         return Promise.reject(refreshError);
//       }
//     }

//     //  Generic error handling
//     if (status === HttpStatus.INTERNAL_SERVER_ERROR) toast.error("Something went wrong on the server.");
//     if (status === HttpStatus.NOT_FOUND) toast.error("Requested resource not found.");

//     return Promise.reject(error);
//   }
// );

// export default api;
