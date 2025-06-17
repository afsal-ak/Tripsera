// import { toast } from "sonner";

// import { createAsyncThunk,createSlice,type PayloadAction } from "@reduxjs/toolkit";

// import { handleLogin } from "@/features/services/auth/authService";
// import type { IUser } from "@/features/types/IUser";

// interface AuthState{
//     user:IUser|null;
//     accessToken:string|null;
//     isAuthenticated:boolean;
//     loading:boolean;
//     error:string|null
// }

// const initialState:AuthState={
//     user:null,
//     accessToken:null,
//     isAuthenticated:false,
//     loading:false,
//     error:null
// }


// export const loginUser=createAsyncThunk("auth/loginUser",
//     async(
//         {email,password}:{email:string;password:string},
//         {rejectWithValue }
//     )=>{
//         try {
       
//         const {user,accessToken}=await handleLogin(email,password)
//         return {user,accessToken};
             
//         } catch (error: any) {
//   const errorMessage =
//     error?.response?.data?.message || error.message || "Login failed";
//   return rejectWithValue(errorMessage);
// }
//     }
// )

// const userAuthSlice=createSlice({
//     name:'user',
//     initialState,
//     reducers:{
//         logout(state){
//             state.user=null;
//             state.accessToken=null;
//             state.isAuthenticated=false;
//             state.loading=false;
//             state.error=null;
//             localStorage.removeItem("accessToken")
//              localStorage.removeItem("user")
            

//         },
//     },

//     extraReducers:(builder)=>{
//         builder
//         .addCase(loginUser.pending,(state)=>{
//             state.loading=true;
//             state.error=null
//         })
//         .addCase(loginUser.fulfilled,
//             (state,action:PayloadAction<{user:IUser;accessToken:string}>)=>{
//                state.loading = false;
//           state.user = action.payload.user;
//           state.accessToken = action.payload.accessToken;
//           state.isAuthenticated = true;
//           state.error = null;
 
//           localStorage.setItem("accessToken",action.payload.accessToken)
//           localStorage.setItem("user",JSON.stringify(action.payload.user))

            
            
//             })
//             .addCase(loginUser.rejected,(state,action)=>{
//                 state.loading=false;
//                 state.error=action.payload as string
//             })
//             }


// })

// export const {logout}=userAuthSlice.actions
// export default userAuthSlice.reducer
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { handleLogin, handleLogout } from "@/features/services/auth/authService";
import type { IUser } from "@/features/types/IUser";


interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}


const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};


// Login Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { user, accessToken } = await handleLogin(email, password);
      return { user, accessToken };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Logout Thunk
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await handleLogout(); // server-side logout
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Logout failed");
    }
  }
);

const userAuthSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
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

          localStorage.setItem("accessToken", action.payload.accessToken);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      });
  },
});


export const { logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
