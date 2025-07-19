import { Route } from "react-router-dom";
import UserProtectedRoutes from "./UserProtectedRoute";
import Home from "@/features/pages/user/home/Home";
import AccountLayout from "@/features/pages/user/accounts/AccountLayout";
import Profile from "@/features/pages/user/accounts/profile/Profile";
import EmailOtpPage from "@/features/pages/user/accounts/profile/EmailOtpPage";
import Wishlist from "@/features/pages/user/accounts/Wishlist";
import CouponList from "@/features/pages/user/accounts/coupons/CouponList";
import WalletPage from "@/features/pages/user/accounts/wallet/WalletPage";
import CheckoutPage from "@/features/pages/user/booking/CheckoutPage";
import BookingSuccessPage from "@/features/pages/user/booking/BookingSuccessPage";
import UserBookingPage from "@/features/pages/user/booking/UserBookingPage";
import BookingDetailPage from "@/features/pages/user/booking/BookingDetailPage";
import PaymentFailed from "@/features/pages/user/booking/PaymentFailed";
const ProtectedRoutes = (

  <Route element={<UserProtectedRoutes />}>
    <Route path="/home" element={<Home />} />
          <Route path="/checkout/:id" element={<CheckoutPage/>}/>
          {/* <Route path="/success" element={<BookingSuccessPage/>}/> */}
<Route path="/booking-success/:id" element={<BookingSuccessPage />} />
<Route path="/booking-failed/:id" element={<PaymentFailed/>} />

       <Route path="/account" element={<AccountLayout/>}>
        <Route path="profile" element={<Profile />} />
        <Route path='verify-otp' element={<EmailOtpPage/>}/>

      <Route path="wishlist" element={<Wishlist/>}/>
      <Route path="coupon" element={<CouponList/>}/>
      <Route path="wallet" element={<WalletPage/>}/>
      <Route path='my-bookings' element={<UserBookingPage/>}/>
      <Route path='my-bookings/:id' element={<BookingDetailPage/>}/>
      </Route>
  </Route>
);

export default ProtectedRoutes;
