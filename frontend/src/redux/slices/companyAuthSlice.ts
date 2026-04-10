import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { handleCompanyLogin } from "@/services/company/companyAuthService";
import type { ICompany } from "@/types/ICompany";

interface CompanyAuthState {
  company: ICompany | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
const companyFromStorage = localStorage.getItem("company");

const initialState: CompanyAuthState = {
  company: companyFromStorage && companyFromStorage !== "undefined"
    ? JSON.parse(companyFromStorage)
    : null,

  accessToken: localStorage.getItem("companyAccessToken"),
  isAuthenticated: !!localStorage.getItem("companyAccessToken"),
  loading: false,
  error: null,
};

export const loginCompany = createAsyncThunk(
  "company/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { company, accessToken } = await handleCompanyLogin(email, password);
 console.log({ company, accessToken },'redux');

      localStorage.setItem("companyAccessToken", accessToken);

      return { company, accessToken };
    } catch (error: any) {
      console.log(error,'in redux company');
      
       const errorMessage = error?.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
      // return rejectWithValue(error.message.data);
    }
  }
);

const companyAuthSlice = createSlice({
  name: "companyAuth",
  initialState,
  reducers: {
    logoutCompany(state) {
      state.company = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("companyAccessToken");
      localStorage.removeItem("company");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        loginCompany.fulfilled,
        (state, action: PayloadAction<{ company: ICompany; accessToken: string }>) => {
          state.loading = false;
          state.company = action.payload.company;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;

          localStorage.setItem("companyAccessToken", action.payload.accessToken);
          localStorage.setItem("company", JSON.stringify(action.payload.company));
        }
      )

      .addCase(loginCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
       // toast.error(action.payload as string);
      });
  },
});

export const { logoutCompany } = companyAuthSlice.actions;

export default companyAuthSlice.reducer;