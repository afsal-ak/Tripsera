import api from "@/lib/axios";
import type { IUser } from "@/features/types/IUser";


export const handlePreRegister = async (email: string, username: string,password:string): Promise<string> => {
  const response = await api.post("/pre-register", { email, username,password });
  return response.data 
};

export const handleVerifyAndRegister  = async (
  email: string,
   otp: string
) => {
  const response = await api.post("/register", { email,otp });
  return response.data;
};
export const handleResendOtp = async (email: string) => {
  const response = await api.post("/resend-otp", { email });
  return response.data;
};

export const handleLogin=async(email:string,password:string)=>{
    const response=await api.post('/login',{email,password})
    return response.data
}

export const handleGoogleLogin=async(token:string)=>{
  const response=await api.post('google-login',{token})
  return response.data
}


export const handleForgotPassword=async(email:string)=>{
  const response=await api.post('/forgotPassword',{email})
  console.log(email,'forgot password')
  return response.data
}
export const handleVerifyOtp=async(email:string,otp:string)=>{
  const response=await api.post('/verify-otp',{email,otp})
  console.log(response,'verify otp')
  return response.data
}
export const handelChangePassword=async(token:string,password:string)=>{
  const response=await api.post('/forgotPasswordChange',{token,password})
  console.log(token,'forgot password')
  return response.data
}

export const handleLogout = async (): Promise<void> => {
  try {
    await api.post("/logout", {}, { withCredentials: true });
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};
export const refreshToken=async()=>{
    const response=await api.get('/refreshToken')
        return response.data

}