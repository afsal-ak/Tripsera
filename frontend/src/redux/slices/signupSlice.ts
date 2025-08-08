import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  handlePreRegister,
  handleVerifyAndRegister,
  handleResendOtp,
} from '@/services/auth/authService';

interface SignupState {
  email: string | null;
  username: string | null;
  password: string | null;
  step: 'idle' | 'otp-sent' | 'verifying' | 'success';
  loading: boolean;
  error: string | null;
}

const initialState: SignupState = {
  email: null,
  username: null,
  password: null,
  step: 'idle',
  loading: false,
  error: null,
};

// 1. Add password to thunk payload
export const preRegisterUser = createAsyncThunk(
  'signup/preRegisterUser',
  async (
    { email, username, password }: { email: string; username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await handlePreRegister(email, username, password);
      return { email, username, password };
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Failed to send OTP';
      return rejectWithValue(message);
    }
  }
);

export const verifyAndRegisterUser = createAsyncThunk(
  'signup/verifyAndRegisterUser',
  async (
    {
      email,
      username,
      password,
      otp,
    }: { email: string; username: string; password: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await handleVerifyAndRegister(email, username, password, otp);
      return data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const resendOtp = createAsyncThunk(
  'signup/resendOtp',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await handleResendOtp(email);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Failed to resend OTP';
      return rejectWithValue(message);
    }
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    resetSignupState: (state) => {
      state.email = null;
      state.username = null;
      state.password = null;
      state.step = 'idle';
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(preRegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(preRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 'otp-sent';
        state.email = action.payload.email;
        state.username = action.payload.username;
        state.password = action.payload.password;
      })
      .addCase(preRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyAndRegisterUser.pending, (state) => {
        state.loading = true;
        state.step = 'verifying';
        state.error = null;
      })
      .addCase(verifyAndRegisterUser.fulfilled, (state) => {
        state.loading = false;
        state.step = 'success';
        state.password = null;
      })
      .addCase(verifyAndRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSignupState } = signupSlice.actions;
export default signupSlice.reducer;

// // src/redux/slices/signupSlice.ts
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { handlePreRegister, handleVerifyAndRegister,handleResendOtp } from "@/features/services/auth/authService";

// interface SignupState {
//   email: string | null;
//   username: string | null;
//   password: string | null;
//   step: "idle" | "otp-sent" | "verifying" | "success";
//   loading: boolean;
//   error: string | null;
// }

// const initialState: SignupState = {
//   email: null,
//   username: null,
//   step: "idle",
//   loading: false,
//   error: null,
// };

// export const preRegisterUser = createAsyncThunk(
//   "signup/preRegisterUser",
//   async (
//     { email, username }: { email: string; username: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       await handlePreRegister(email, username);
//       return { email, username };
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.message || error.message || "Failed to send OTP";
//       return rejectWithValue(message);
//     }
//   }
// );

// export const verifyAndRegisterUser = createAsyncThunk(
//   "signup/verifyAndRegisterUser",
//   async (
//     {
//       email,
//       username,
//       password,
//       otp,
//     }: { email: string; username: string; password: string; otp: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const data = await handleVerifyAndRegister(email, username, password, otp);
//       return data;
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.message || error.message || "Registration failed";
//       return rejectWithValue(message);
//     }
//   }
// );
// export const resendOtp = createAsyncThunk(
//   "signup/resendOtp",
//   async ({ email }: { email: string }, { rejectWithValue }) => {
//     try {
//       const response = await handleResendOtp(email);
//       return response;
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.message || error.message || "Failed to resend OTP";
//       return rejectWithValue(message);
//     }
//   }
// );
// const signupSlice = createSlice({
//   name: "signup",
//   initialState,
//   reducers: {
//     resetSignupState: (state) => {
//       state.email = null;
//       state.username = null;
//       state.step = "idle";
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(preRegisterUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(preRegisterUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.step = "otp-sent";
//         state.email = action.payload.email;
//         state.username = action.payload.username;
//       })
//       .addCase(preRegisterUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(verifyAndRegisterUser.pending, (state) => {
//         state.loading = true;
//         state.step = "verifying";
//         state.error = null;
//       })
//       .addCase(verifyAndRegisterUser.fulfilled, (state) => {
//         state.loading = false;
//         state.step = "success";
//       })
//       .addCase(verifyAndRegisterUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { resetSignupState } = signupSlice.actions;
// export default signupSlice.reducer;
