import userApi from '@/lib/axios/userAxios';

export const handlePreRegister = async (
  email: string,
  username: string,
  password: string,
  referralCode?:string
): Promise<string> => {
  const response = await userApi.post(`/pre-register?referralCode=${referralCode}`, { email, username, password });
  return response.data;
};

export const handleVerifyAndRegister = async (email: string, otp: string) => {
  const response = await userApi.post('/register', { email, otp });
  return response.data;
};
export const handleResendOtp = async (email: string) => {
  const response = await userApi.post('/resend-otp', { email });
  return response.data;
};

export const handleLogin = async (email: string, password: string) => {
  const response = await userApi.post('/login', { email, password });
  console.log(response,'from service')
  return response.data;
};

export const handleGoogleLogin = async (token: string) => {
  const response = await userApi.post('google-login', { token });
  return response.data;
};

export const handleForgotPassword = async (email: string) => {
  const response = await userApi.post('/forgotPassword', { email });
  console.log(email, 'forgot password');
  return response.data;
};
export const handleVerifyOtp = async (email: string, otp: string) => {
  const response = await userApi.post('/verify-otp', { email, otp });
  console.log(response, 'verify otp');
  return response.data;
};
export const handelChangePassword = async (token: string, password: string) => {
  const response = await userApi.post('/forgotPasswordChange', { token, password });
  console.log(token, 'forgot password');
  return response.data;
};

export const handleLogout = async (): Promise<void> => {
  try {
    await userApi.post('/logout', {}, { withCredentials: true });
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Logout failed');
  }
};
export const refreshToken = async () => {
  const response = await userApi.get('/refreshToken');
  return response.data;
};
