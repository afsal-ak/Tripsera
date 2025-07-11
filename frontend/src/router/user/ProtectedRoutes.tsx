import { Route } from "react-router-dom";
import UserProtectedRoutes from "./UserProtectedRoute";
import Home from "@/features/pages/user/home/Home";
import AccountLayout from "@/features/pages/user/accounts/AccountLayout";
import Profile from "@/features/pages/user/accounts/profile/Profile";
import EmailOtpPage from "@/features/pages/user/accounts/profile/EmailOtpPage";
import Wishlist from "@/features/pages/user/accounts/Wishlist";
import CouponList from "@/features/pages/user/accounts/coupons/CouponList";
 const ProtectedRoutes = (

  <Route element={<UserProtectedRoutes />}>
    <Route path="/home" element={<Home />} />
       <Route path="/account" element={<AccountLayout/>}>
        <Route path="profile" element={<Profile />} />
        <Route path='verify-otp' element={<EmailOtpPage/>}/>
      <Route path="wishlist" element={<Wishlist/>}/>
      <Route path="coupon" element={<CouponList/>}/>
      </Route>
  </Route>
);

export default ProtectedRoutes;
