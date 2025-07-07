 import { Routes, Route } from "react-router-dom";
import AdminLogin from "@/features/pages/admin/pages/AdminLogin";
import AdminLayout from "@/features/pages/admin/components/AdminLayout";
import AdminPrivateRoute from "./AdminPrivateRoute";
// Admin pages
import AdminDashboard from "@/features/pages/admin/pages/AdminDashboard";
import UserList from "@/features/pages/admin/pages/UsersList";
import AddCategory from "@/features/pages/admin/pages/category/AddCategory";
import CategoryList from "@/features/pages/admin/pages/category/CategoryList";
import EditCategory from "@/features/pages/admin/pages/category/EditCategory";
import BannerList from "@/features/pages/admin/pages/banner/BannerList";
import AddBanner from "@/features/pages/admin/pages/banner/AddBanner";
import AddPackageForm from "@/features/pages/admin/pages/package/AddPackageForm";
import PackageList from "@/features/pages/admin/pages/package/PackageList";
import EditPackageForm from "@/features/pages/admin/pages/package/EditPackage";
import CouponList from "@/features/pages/admin/pages/coupon/CouponList";
import AddCouponForm from "@/features/pages/admin/pages/coupon/AddCouponForm";
import EditCouponForm from "@/features/pages/admin/pages/coupon/EditCouponForm";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      {/*  Protected Admin Routes */}
      <Route path="/admin" element={<AdminPrivateRoute />}>
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

        </Route>
      </Route>
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
