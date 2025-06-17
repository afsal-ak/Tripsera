import adminApi from "@/lib/axios/adminAxios"
 
export const handleAdminLogin = async (email: string, password: string) => {
  try {
    const res = await adminApi.post('/admin-login', { email, password });

    if (!res.data?.admin || !res.data?.accessToken) {
      throw new Error("Invalid response format");
    }

    return res.data; // ✅ expected: { admin, accessToken, refreshToken }

  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Login failed";
    throw new Error(message); // ✅ throw this to handle in Redux or UI
  }
};


export const handleAdminLogout = async (): Promise<void> => {
  try {
    await adminApi.post("/logout", {}, { withCredentials: true });
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

export const refreshToken=async()=>{
    const res=await adminApi.post('/refreshToken')
        return res.data

}