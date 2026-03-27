import { Fragment } from "react";
import { Route } from "react-router-dom";
 
import CompanySignup from "@/pages/company/auth/Signup";
import CompanyLogin from "@/pages/company/auth/Login";
import CompanyVerifyOtp from "@/pages/company/auth/OtpPage";
import CompanyForgotPassword from "@/pages/company/auth/ForgotPassword";
import CompanyForgotOtpPage from "@/pages/company/auth/ForgotOtpPage";
import CompanyNewPasswordPage from "@/pages/company/auth/NewPasswordPage";
import RedirectIfAuth from "../user/RedirectIfAuth";

const companyPublicRoutes = (
  <Fragment>
    <Route path="signup" element={<CompanySignup />} />

    <Route path="login" element={<CompanyLogin />} />

    <Route path="verify-otp" element={<CompanyVerifyOtp />} />
    <Route path="forgot-password" element={<CompanyForgotPassword />} />
    <Route path="forgot-password/verfy-otp" element={<CompanyForgotOtpPage />} />
    <Route
      path="forgot-password/change-password"
      element={<CompanyNewPasswordPage />}
    />
  </Fragment>
);


export default companyPublicRoutes;