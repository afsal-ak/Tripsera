import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { handleAdminLogin } from "@/features/services/admin/adminService";
import type { IAdmin } from "@/features/types/IAdmin";
interface AdminAuthState {
  admin: IAdmin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AdminAuthState = {
  admin: JSON.parse(localStorage.getItem("admin") || "null"),
  accessToken: localStorage.getItem("adminAccessToken"),
  isAuthenticated: !!localStorage.getItem("adminAccessToken"),
  loading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { admin, accessToken, refreshToken } = await handleAdminLogin(email, password);

      localStorage.setItem("adminAccessToken", accessToken);
      return { admin, accessToken };

    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    logoutAdmin(state) {
      state.admin = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("admin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginAdmin.fulfilled,
        (state, action: PayloadAction<{ admin: IAdmin; accessToken: string }>) => {
          state.loading = false;
          state.admin = action.payload.admin;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
          localStorage.setItem("adminAccessToken", action.payload.accessToken);
          localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        }
      )
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
