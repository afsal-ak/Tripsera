import { Routes, Route } from 'react-router-dom';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/layouts/AdminLayout';
import AdminPrivateRoute from './AdminPrivateRoute';
import NotFoundPage from '@/components/NotFoundPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserList from '@/pages/admin/UsersList';
import AddCategory from '@/pages/admin/category/AddCategory';
import CategoryList from '@/pages/admin/category/CategoryList';
import EditCategory from '@/pages/admin/category/EditCategory';
import BannerList from '@/pages/admin/banner/BannerList';
import AddBanner from '@/pages/admin/banner/AddBanner';
import AddPackageForm from '@/pages/admin/package/AddPackageForm';
import PackageList from '@/pages/admin/package/PackageList';
import EditPackageForm from '@/pages/admin/package/EditPackage';
import CouponList from '@/pages/admin/coupon/CouponList';
import AddCouponForm from '@/pages/admin/coupon/AddCouponForm';
import EditCouponForm from '@/pages/admin/coupon/EditCouponForm';
import BookingList from '@/pages/admin/booking/BookingsList';
import BookingDetail from '@/pages/admin/booking/BookingDetails';
import AdminBlogList from '@/pages/admin/blog/BlogListPage';
import BlogDetail from '@/pages/admin/blog/BlogDetail';
import ReviewList from '@/pages/admin/review/ReviewList';
import ReviewDetail from '@/pages/admin/review/ReviewDetail';
import ReferralPage from '@/pages/admin/referral/ReferralPage';
import SalesReportPage from '@/pages/admin/SalesReportPage';
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      {/*  Protected Admin Routes */}
      <Route element={<AdminPrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          <Route path="category/:id/block" element={<CategoryList />} />
          <Route path="category/:id/unblock" element={<CategoryList />} />
          <Route path="banners" element={<BannerList />} />
          <Route path="banners/add" element={<AddBanner />} />
          <Route path="banner/block/:id" element={<BannerList />} />
          <Route path="banner/unblock/:id" element={<BannerList />} />
          <Route path="packages/add" element={<AddPackageForm />} />
          <Route path="packages" element={<PackageList />} />
          <Route path="package/edit/:id" element={<EditPackageForm />} />
          <Route path="packages/block/:id" element={<PackageList />} />
          <Route path="packages/unblock/:id" element={<PackageList />} />
          <Route path="coupons" element={<CouponList />} />
          <Route path="coupon/add" element={<AddCouponForm />} />
          <Route path="coupon/edit/:id" element={<EditCouponForm />} />
          <Route path="coupon/status/:id" element={<CouponList />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="blogs" element={<AdminBlogList />} />
          <Route path="blogs/:blogId" element={<BlogDetail />} />
          <Route path="reviews" element={<ReviewList />} />
          <Route path="reviews/:reviewId" element={<ReviewDetail />} />
          <Route path="referral" element={<ReferralPage />} />
          <Route path="sales-report" element={<SalesReportPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;

// import React from "react";
// import { Routes,Route } from "react-router-dom";
// // import Dashboard from "@/features/pages/admin/pages/Dashboard";
// import AdminLogin from "@/features/pages/admin/pages/AdminLogin";
// import AdminLayout from "@/features/pages/admin/components/AdminLayout";
// import AdminDashboard from "@/features/pages/admin/pages/AdminDashboard";
// import UserList from "@/features/pages/admin/pages/UsersList";
// import AddCategory from "@/features/pages/admin/pages/Category.tsx/AddCategory";
// import CategoryList from "@/features/pages/admin/pages/Category.tsx/CategoryList";
// import EditCategory from "@/features/pages/admin/pages/Category.tsx/EditCategory";
// import BannerList from "@/features/pages/admin/pages/banner/BannerList";
// import AddBanner from "@/features/pages/admin/pages/banner/AddBanner";
// import AddPackageForm from "@/features/pages/admin/pages/package/AddPackageForm";
// import PackageList from "@/features/pages/admin/pages/package/PackageList";
// import EditPackageForm from "@/features/pages/admin/pages/package/EditPackage";
// const AdminRoutes=()=>{
//     return(
//         <Routes>
//         <Route path="/admin/login" element={<AdminLogin/>} />

//       <Route path="/admin" element={<AdminLayout />}>
//           <Route path="dashboard" element={<AdminDashboard/>} />
//           <Route path='users'  element={<UserList/>} />
//            <Route path="categories" element={<CategoryList />} />
//           <Route path="categories/add" element={<AddCategory />} />
//           <Route path="categories/edit/:id" element={<EditCategory />} />
//           <Route path="category/:id/block" element={<CategoryList />} />
//           <Route path="category/:id/unblock" element={<CategoryList />} />
//           <Route path="banners" element={<BannerList />} />
//           <Route path="banners/add" element={<AddBanner />} />
//           <Route path="banner/block/:id" element={<BannerList />} />
//           <Route path="banner/unblock/:id" element={<BannerList />} />
//           <Route path="packages/add" element={<AddPackageForm />} />
//           <Route path="packages" element={<PackageList />} />
//           <Route path="package/edit/:id" element={<EditPackageForm />} />
//           <Route path="packages/block/:id" element={<PackageList />} />
//           <Route path="packages/unblock/:id" element={<PackageList />} />

//       </Route>

//         </Routes>
//     )
// }
// export default AdminRoutes
