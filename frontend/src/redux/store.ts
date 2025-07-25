import { configureStore } from '@reduxjs/toolkit';
import userAuthReducer from './slices/userAuthSlice';
import signupReducer from './slices/signupSlice';
import adminAuthReducer from './slices/adminAuthSlice';

export const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    signup: signupReducer,
    adminAuth: adminAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
