import { Routes, Route } from "react-router-dom";

import CompanyLogin from "@/pages/company/auth/Login";
import CompanySetupPage from "@/pages/company/company-setup/CompanySetupPage";

import CompanyPrivateRoute from "./CompanyPrivateRoute";
import CompanySetupRoute from "./CompanySetupRoute";

import Dashboard from "@/pages/company/dashboard/DashboardPage";
import CompanyProfilePage from "@/pages/company/company-setup/CompanyProfilePage";
import CompanySignup from "@/pages/company/auth/Signup";
import companyPublicRoutes from "./companyPublicRoutes";
import CompanyLayout from "@/layouts/CompanyLayout";

import PackageList from "@/pages/company/package/PackageList";
import AddPackageForm from "@/pages/company/package/AddPackageForm";
import EditPackageForm from "@/pages/company/package/EditPackage";
import PackageDetails from "@/pages/company/package/PackageDetail";

import NotificationPage from "@/pages/admin/notification/Notifications";
import ChatAdminLayout from "@/layouts/ChatAdminLayout";
import MessageMainPage from "@/pages/admin/chat/MessageMainPage";
const CompanyRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="login" element={<CompanyLogin />} />
      <Route path="signup" element={<CompanySignup />} />
      {companyPublicRoutes}

      {/* Setup (only if NOT completed) */}
      <Route element={<CompanySetupRoute />}>
        <Route path="setup" element={<CompanySetupPage />} />
        <Route path="company-profile" element={<CompanyProfilePage />} />
      </Route>


        <Route element={<CompanyLayout />}>

      {/* Protected (only if setup completed) */}
      <Route element={<CompanyPrivateRoute />}>
        <Route path="dashboard" element={<Dashboard />} />

          {/* Packages (shared) */}
          <Route path="packages" element={<PackageList />} />
          <Route path="packages/add" element={<AddPackageForm />} />
          <Route path="package/edit/:id" element={<EditPackageForm />} />

          {/* Optional shared detail */}
          <Route path="package/:id" element={<PackageDetails />} />

          {/* Optional shared block/unblock */}
          <Route path="packages/block/:id" element={<PackageList />} />
          <Route path="packages/unblock/:id" element={<PackageList />} />


    {/* Notifications */}
          <Route path="notification" element={<NotificationPage />} />

          {/* Chat */}
          <Route path="/chat" element={<ChatAdminLayout />}>
            <Route path=":roomId" element={<MessageMainPage />} />
          </Route>


      </Route>
    </Route>


    </Routes>
  );
};



// const CompanyRoutes = () => {
//   return (
//     <Routes>

//       <Route path="login" element={<CompanyLogin />} />
//     <Route path="signup" element={<CompanySignup />} />
//         {companyPublicRoutes}

//       {/* Setup Route */}
//       {/* <Route element={<CompanyPrivateRoute />}> */}
//         <Route element={<CompanySetupRoute />}>
//           <Route path="setup" element={<CompanySetupPage />} />
//           <Route path="company-profile" element={<CompanyProfilePage />} />
//         </Route>
//       {/* </Route> */}

//       {/* Dashboard */}
//       <Route element={<CompanyPrivateRoute />}>
//         <Route path="dashboard" element={<Dashboard />} />
//       </Route>

//     </Routes>
//   );
// };

export default CompanyRoutes;

