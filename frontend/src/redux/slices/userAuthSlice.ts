import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { handleLogin, handleLogout } from '@/services/auth/authService';
import type { IUser } from '@/types/IUser';

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

// Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { user, accessToken } = await handleLogin(email, password);
      console.log(accessToken, 'toekn from redux');
      console.log('user from redux', user);
      return { user, accessToken };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await handleLogout();
    return true;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || 'Logout failed');
  }
});

const userAuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: IUser; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: IUser; accessToken: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
          state.error = null;

          localStorage.setItem('accessToken', action.payload.accessToken);
          //  console.log(action.payload.accessToken,'redux')
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        //console.log(state.accessToken,'redux')

        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      });
  },
});

export const { logout, setUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;
