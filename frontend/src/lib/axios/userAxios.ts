import axios from "axios";

const userApi=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL+"/user",
    withCredentials:true,
    headers: {
    "Content-Type": "application/json",
    // Add Authorization header if using token-based auth
    // Authorization: `Bearer ${adminToken}`
  },
})

export default userApi;
