import { Routes, Route } from 'react-router-dom';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/layouts/AdminLayout';
import AdminPrivateRoute from './AdminPrivateRoute';
import NotFoundPage from '@/components/NotFoundPage';

// Admin pages
import DashboardPage from '@/pages/admin/dashboard/DashboardPage';
import UserList from '@/pages/admin/user/UsersList';
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
import ReportList from '@/pages/admin/report/ReportList';
import ReportDetails from '@/pages/admin/report/ReportDetails';
import UserDetailsPage from '@/pages/admin/user/UserDetailsPage';
import CustomPackagePage from '@/pages/admin/cutomPackage/CustomPackagePage';
import CustomPackageDetails from '@/pages/admin/cutomPackage/CustomPackageDetailsPage';
import MessageMainPage from '@/pages/admin/chat/MessageMainPage';
import ChatAdminLayout from '@/layouts/ChatAdminLayout';
import NotificationPage from '@/pages/admin/notification/Notifications';
import CreateCustomPackagePage from '@/pages/admin/cutomPackage/CreateCustomPackagePage';
import CustomApprovedPkg from '@/pages/admin/cutomPackage/CustomApprovedPkg';
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      {/*  Protected Admin Routes */}
      <Route element={<AdminPrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetailsPage />} />
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
          <Route path="reports" element={<ReportList />} />
          <Route path="reports/:reportId" element={<ReportDetails />} />
          <Route path="custom-packages" element={<CustomPackagePage />} />
          <Route path="custom-packages/:pkgId" element={<CustomPackageDetails />} />
<Route path="custom-package/create/:customId" element={<CreateCustomPackagePage />} />
<Route path="custom-packages/approved" element={<CustomApprovedPkg />} />
          <Route path="notification" element={<NotificationPage />} />

          <Route path="/chat" element={<ChatAdminLayout />}>
            <Route path=":roomId" element={<MessageMainPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;
