import { Route } from 'react-router-dom';
import { lazy } from 'react';
import UserProtectedRoutes from './UserProtectedRoute';

// Lazy imports
const Home = lazy(() => import('@/pages/user/home/Home'));
const AccountLayout = lazy(() => import('@/pages/user/accounts/AccountLayout'));
const Profile = lazy(() => import('@/pages/user/profile/Profile'));
const EmailOtpPage = lazy(() => import('@/pages/user/profile/EmailOtpPage'));
const Wishlist = lazy(() => import('@/pages/user/accounts/Wishlist'));
const CouponList = lazy(() => import('@/pages/user/coupons/CouponList'));
const WalletPage = lazy(() => import('@/pages/user/wallet/WalletPage'));

const CheckoutPage = lazy(() => import('@/pages/user/booking/CheckoutPage'));
const AddTravellerCheckoutPage = lazy(() => import('@/pages/user/booking/AddTravellerCheckoutPage'));
const BookingSuccessPage = lazy(() => import('@/pages/user/booking/BookingSuccessPage'));
const UserBookingPage = lazy(() => import('@/pages/user/booking/UserBookingPage'));
const BookingDetailPage = lazy(() => import('@/pages/user/booking/BookingDetailPage'));
const PaymentFailed = lazy(() => import('@/pages/user/booking/PaymentFailed'));

const AddBlogForm = lazy(() => import('@/pages/user/blog/AddBlogForm'));
const EditBlogForm = lazy(() => import('@/pages/user/blog/EditBlogForm'));
const UserBlogsPage = lazy(() => import('@/pages/user/blog/UserBlogsPage'));
const UserBlogDetails = lazy(() => import('@/pages/user/blog/UserBlogDetail'));

const ReviewPage = lazy(() => import('@/pages/user/reviews/ReviewPage'));
const ReviewForm = lazy(() => import('@/pages/user/reviews/ReviewForm'));
const UserReviewPage = lazy(() => import('@/pages/user/reviews/UserReview'));
const ReviewDetail = lazy(() => import('@/pages/user/reviews/ReviewDetail'));
const ReviewEditForm = lazy(() => import('@/pages/user/reviews/ReviewEditForm'));

const PublicProfile = lazy(() => import('@/pages/user/profile/PublicProfile'));

const AddCustomPkgForm = lazy(() => import('@/pages/user/customPkg/AddCustomPackageForm'));
const EditCustomPkgForm = lazy(() => import('@/pages/user/customPkg/EditCustomPkgForm'));
const CustomPackagePage = lazy(() => import('@/pages/user/customPkg/CustomPackagePage'));
const CustomPackageDetails = lazy(() => import('@/pages/user/customPkg/CustomPackageDetailsPage'));
const UserCustomPackagesPage = lazy(() => import('@/pages/user/customPkg/UserCustomPackagesPage'));

const ChatBot = lazy(() => import('@/pages/user/chatbot/ChatBot'));
const UserSearchAndMessage = lazy(() => import('@/components/chat/UserSearchForChat'));
const ChatLayout = lazy(() => import('@/layouts/ChatLayout'));
const MessageMainPage = lazy(() => import('@/pages/user/chat/MessageMainPage'));

const NotificationPage = lazy(() => import('@/pages/user/notification/Notifications'));

const ProtectedRoutes = (
  <Route element={<UserProtectedRoutes />}>
    <Route path="/home" element={<Home />} />
    <Route path="/checkout/:id" element={<CheckoutPage />} />
    <Route path="/checkout/add-traveller/:packageId/:bookingId" element={<AddTravellerCheckoutPage />} />
    <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
    <Route path="/booking-failed/:id" element={<PaymentFailed />} />

    <Route path="/packages/:packageId/review" element={<ReviewPage />} />
    <Route path="/packages/:packageId/review/add" element={<ReviewForm />} />

    <Route path="/profile/:username" element={<PublicProfile />} />
    <Route path="/custom-package" element={<AddCustomPkgForm />} />

    <Route path="/chatbot" element={<ChatBot />} />
    <Route path="/user" element={<UserSearchAndMessage />} />
    <Route path="/notification" element={<NotificationPage />} />

    <Route path="/chat" element={<ChatLayout />}>
      <Route path=":roomId" element={<MessageMainPage />} />
    </Route>

    <Route path="/account" element={<AccountLayout />}>
      <Route path="profile" element={<Profile />} />
      <Route path="verify-otp" element={<EmailOtpPage />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="coupon" element={<CouponList />} />
      <Route path="wallet" element={<WalletPage />} />
      <Route path="my-bookings" element={<UserBookingPage />} />
      <Route path="my-bookings/:id" element={<BookingDetailPage />} />
      <Route path="my-blogs" element={<UserBlogsPage />} />
      <Route path="my-blogs/add" element={<AddBlogForm />} />
      <Route path="my-blogs/:slug" element={<UserBlogDetails />} />
      <Route path="my-blogs/edit/:blogId" element={<EditBlogForm />} />
      <Route path="my-reviews" element={<UserReviewPage />} />
      <Route path="my-reviews/:reviewId" element={<ReviewDetail />} />
      <Route path="my-reviews/:reviewId/edit" element={<ReviewEditForm />} />
      <Route path="my-custom-package" element={<CustomPackagePage />} />
      <Route path="my-custom-package/:pkgId" element={<CustomPackageDetails />} />
      <Route path="my-custom-package/edit/:id" element={<EditCustomPkgForm />} />
      <Route path="my-custom-package/user" element={<UserCustomPackagesPage />} />
    </Route>
  </Route>
);

export default ProtectedRoutes;

// import { Route } from 'react-router-dom';
// import UserProtectedRoutes from './UserProtectedRoute';
// import Home from '@/pages/user/home/Home';
// import AccountLayout from '@/pages/user/accounts/AccountLayout';
// import Profile from '@/pages/user/profile/Profile';
// import EmailOtpPage from '@/pages/user/profile/EmailOtpPage';
// import Wishlist from '@/pages/user/accounts/Wishlist';
// import CouponList from '@/pages/user/coupons/CouponList';
// import WalletPage from '@/pages/user/wallet/WalletPage';
// import CheckoutPage from '@/pages/user/booking/CheckoutPage';
// import AddTravellerCheckoutPage from '@/pages/user/booking/AddTravellerCheckoutPage';
// import BookingSuccessPage from '@/pages/user/booking/BookingSuccessPage';
// import UserBookingPage from '@/pages/user/booking/UserBookingPage';
// import BookingDetailPage from '@/pages/user/booking/BookingDetailPage';
// import PaymentFailed from '@/pages/user/booking/PaymentFailed';
// import AddBlogForm from '@/pages/user/blog/AddBlogForm';
// import EditBlogForm from '@/pages/user/blog/EditBlogForm';
// import UserBlogsPage from '@/pages/user/blog/UserBlogsPage';
// import UserBlogDetails from '@/pages/user/blog/UserBlogDetail';
// import ReviewPage from '@/pages/user/reviews/ReviewPage';
// import ReviewForm from '@/pages/user/reviews/ReviewForm';
// import UserReviewPage from '@/pages/user/reviews/UserReview';
// import ReviewDetail from '@/pages/user/reviews/ReviewDetail';
// import PublicProfile from '@/pages/user/profile/PublicProfile';
// import ReviewEditForm from '@/pages/user/reviews/ReviewEditForm';
// import AddCustomPkgForm from '@/pages/user/customPkg/AddCustomPackageForm';
// import EditCustomPkgForm from '@/pages/user/customPkg/EditCustomPkgForm';
// import CustomPackagePage from '@/pages/user/customPkg/CustomPackagePage';
// import CustomPackageDetails from '@/pages/user/customPkg/CustomPackageDetailsPage';
// import UserCustomPackagesPage from '@/pages/user/customPkg/UserCustomPackagesPage';
// import ChatBot from '@/pages/user/chatbot/ChatBot';
// import UserSearchAndMessage from '@/components/chat/UserSearchForChat';
// import ChatLayout from '@/layouts/ChatLayout';
// import MessageMainPage from '@/pages/user/chat/MessageMainPage';
// import NotificationPage from '@/pages/user/notification/Notifications';
// const ProtectedRoutes = (
//   <Route element={<UserProtectedRoutes />}>
//     <Route path="/home" element={<Home />} />
//     <Route path="/checkout/:id" element={<CheckoutPage />} />
//  <Route
//   path="/checkout/add-traveller/:packageId/:bookingId"
//   element={<AddTravellerCheckoutPage />}
// />
//     {/* <Route path="/checkout/add-traveller/:id" element={<AddTravellerCheckoutPage />} /> */}
//     <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
//     <Route path="/booking-failed/:id" element={<PaymentFailed />} />
//     <Route path="/packages/:packageId/review" element={<ReviewPage />} />
//     <Route path="/packages/:packageId/review/add" element={<ReviewForm />} />
//     <Route path="/profile/:username" element={<PublicProfile />} />
//     <Route path="/custom-package" element={<AddCustomPkgForm />} />
//     <Route path="/chatbot" element={<ChatBot />} />
//     <Route path="/user" element={<UserSearchAndMessage />} />
//     <Route path="/notification" element={<NotificationPage />} />

//     <Route path="/chat" element={<ChatLayout />}>
//       <Route path=":roomId" element={<MessageMainPage />} />
//     </Route>

//     <Route path="/account" element={<AccountLayout />}>
//       <Route path="profile" element={<Profile />} />
//       <Route path="verify-otp" element={<EmailOtpPage />} />

//       <Route path="wishlist" element={<Wishlist />} />
//       <Route path="coupon" element={<CouponList />} />
//       <Route path="wallet" element={<WalletPage />} />
//       <Route path="my-bookings" element={<UserBookingPage />} />
//       <Route path="my-bookings/:id" element={<BookingDetailPage />} />
//       <Route path="my-blogs" element={<UserBlogsPage />} />
//       <Route path="my-blogs/add" element={<AddBlogForm />} />
//       <Route path="my-blogs/:slug" element={<UserBlogDetails />} />
//       <Route path="my-blogs/edit/:blogId" element={<EditBlogForm />} />
//       <Route path="my-reviews" element={<UserReviewPage />} />
//       <Route path="my-reviews/:reviewId" element={<ReviewDetail />} />
//       <Route path="my-reviews/:reviewId/edit" element={<ReviewEditForm />} />
//       <Route path="my-custom-package" element={<CustomPackagePage />} />
//       <Route path="my-custom-package/:pkgId" element={<CustomPackageDetails />} />
//       <Route path="my-custom-package/edit/:id" element={<EditCustomPkgForm />} />
//       <Route path="my-custom-package/user" element={<UserCustomPackagesPage />} />

//     </Route>
//   </Route>
// );
// export default ProtectedRoutes;
