// import axios from "axios";

// const adminApi=axios.create({
//     baseURL:import.meta.env.VITE_API_BASE_URL+"/admin",
//     withCredentials:true,
//     headers: {
//     "Content-Type": "application/json",
//     // Add Authorization header if using token-based auth
//     // Authorization: `Bearer ${adminToken}`
//   },
// })

// export default adminApi;
import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/admin",
  withCredentials: true,
});

// ✅ Attach access token to every admin request
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminAccessToken");
    if (adminToken && config.headers) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auto refresh token on 401
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/admin-login") &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
       const res = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/admin/refresh-token`,
  {}, // empty body
  { withCredentials: true } // ✅ this ensures cookies are sent
);

        const { accessToken } = res.data;
        localStorage.setItem("adminAccessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("adminAccessToken");
        return Promise.reject(refreshError);
      }
    }

    console.error("Admin API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default adminApi;
