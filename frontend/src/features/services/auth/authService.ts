import api from "@/lib/axios";
import type { IUser } from "@/features/types/IUser";


export const handlePreRegister = async (email: string, username: string): Promise<string> => {
  const response = await api.post("/pre-register", { email, username });
  return response.data 
};

export const handleVerifyAndRegister  = async (
  email: string,
  username: string,
  password: string,
  otp: string
) => {
  const response = await api.post("/register", { email, username, password, otp });
  return response.data;
};
export const handleResendOtp = async (email: string) => {
  const response = await api.post("/resend-otp", { email });
  return response.data;
};

export const handleLogin=async(email:string,password:string)=>{
    const res=await api.post('/login',{email,password})
    return res.data
}



export const handleLogout = async (): Promise<void> => {
  try {
    await api.post("/logout", {}, { withCredentials: true });
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};
export const refreshToken=async()=>{
    const res=await api.get('/refreshToken')
        return res.data

}