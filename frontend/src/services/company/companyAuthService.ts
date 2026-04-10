import api from "@/lib/axios/api";

/* ---------------- PRE REGISTER ---------------- */

export const handleCompanyPreRegister = async (
  email: string,
  username: string,
  password: string,
  referralCode?: string
): Promise<string> => {
  const query = referralCode ? `?referralCode=${referralCode}` : "";

  const response = await api.post(`/company/pre-register${query}`, {
    email,
    username,
    password,
  });

  return response.data;
};

/* ---------------- VERIFY REGISTER ---------------- */

export const handleCompanyVerifyAndRegister = async (email: string, otp: string) => {
  const response = await api.post("/company/register", { email, otp });
  return response.data;
};

/* ---------------- RESEND OTP ---------------- */

export const handleCompanyResendOtp = async (email: string) => {
  const response = await api.post("/company/resend-otp", { email });
  return response.data;
};

/* ---------------- LOGIN ---------------- */

export const handleCompanyLogin = async (email: string, password: string) => {
  const response = await api.post("/company/login", { email, password });
  return response.data;
};

/* ---------------- GOOGLE LOGIN ---------------- */

export const handleCompanyGoogleLogin = async (token: string) => {
  const response = await api.post("/company/google-login", { token });
  return response.data;
};

/* ---------------- FORGOT PASSWORD ---------------- */

export const handleCompanyForgotPassword = async (email: string) => {
  const response = await api.post("/company/forgotPassword", { email });
  return response.data;
};

/* ---------------- VERIFY OTP ---------------- */

export const handleCompanyVerifyOtp = async (email: string, otp: string) => {
  const response = await api.post("/company/verify-otp", { email, otp });
  return response.data;
};

/* ---------------- CHANGE PASSWORD ---------------- */

export const handleCompanyChangePassword = async (token: string, password: string) => {
  const response = await api.post("/company/forgotPasswordChange", { token, password });
  return response.data;
};



export const passwordChange = async (currentPassword: string, newPassword: string) => {
  const response = await api.post('/company/password/change', { currentPassword, newPassword });
  return response.data;
};
/* ---------------- LOGOUT ---------------- */

export const handleCompanyLogout = async (): Promise<void> => {
  try {
    localStorage.removeItem("companyAccessToken");
    localStorage.removeItem("company");

    await api.post("/company/logout", {}, { withCredentials: true });
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

/* ---------------- REFRESH TOKEN ---------------- */

export const refreshCompanyToken = async () => {
  const response = await api.get("/company/refresh-token");
  return response.data;
};


// import api from '@/lib/axios/api';
// export const handlePreRegister = async (
//   email: string,
//   username: string,
//   password: string,
//   referralCode?: string
// ): Promise<string> => {
//   const response = await api.post(`/company/pre-register?referralCode=${referralCode}`, {
//     email,
//     username,
//     password,
//   });
//   return response.data;
// };

// export const handleVerifyAndRegister = async (email: string, otp: string) => {
//   const response = await api.post('/company/register', { email, otp });
//   return response.data;
// };
// export const handleResendOtp = async (email: string) => {
//   const response = await api.post('/company/resend-otp', { email });
//   return response.data;
// };

// export const handleCompanyLogin = async (email: string, password: string) => {
//   const response = await api.post('/company/login', { email, password });
//   console.log(response, 'from service');
//   return response.data;
// };

// export const handleGoogleLogin = async (token: string) => {
//   const response = await api.post('/company/google-login', { token });
//   return response.data;
// };

// export const handleForgotPassword = async (email: string) => {
//   const response = await api.post('/company/forgotPassword', { email });
//   console.log(email, 'forgot password');
//   return response.data;
// };
// export const handleVerifyOtp = async (email: string, otp: string) => {
//   const response = await api.post('/company/verify-otp', { email, otp });
//   console.log(response, 'verify otp');
//   return response.data;
// };
// export const handelChangePassword = async (token: string, password: string) => {
//   const response = await api.post('/company/forgotPasswordChange', { token, password });
//   console.log(token, 'forgot password');
//   return response.data;
// };

// export const handleLogout = async (): Promise<void> => {
//   try {
//         localStorage.removeItem('accessToken');
//     localStorage.removeItem('company'); 
//     await api.post('/company/logout', {}, { withCredentials: true });
//   } catch (error: any) {
//     throw new Error(error?.response?.data?.message || 'Logout failed');
//   }
// };
// export const refreshToken = async () => {
//   const response = await api.get('/company/refreshToken');
//   return response.data;
// };
