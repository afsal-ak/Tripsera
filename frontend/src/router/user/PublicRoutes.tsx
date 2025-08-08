import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import RedirectIfAuth from './RedirectIfAuth ';
import Signup from '@/pages/user/auth/Signup';
import Login from '@/pages/user/auth/Login';
import VerifyOtp from '@/pages/user/auth/OtpPage';
import ForgotPassword from '@/pages/user/auth/ForgotPassword';
import ForgotOtpPage from '@/pages/user/auth/ForgotOtpPage';
import NewPasswordPage from '@/pages/user/auth/NewPasswordPage';
const publicRoutes = (
  <Fragment>
    <Route path="/signup" element={<Signup />} />
    <Route
      path="/login"
      element={
        <RedirectIfAuth>
          <Login />
        </RedirectIfAuth>
      }
    />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/forgot-password/verfy-otp" element={<ForgotOtpPage />} />
    <Route path="/forgot-password/change-password" element={<NewPasswordPage />} />
  </Fragment>
);

export default publicRoutes;
