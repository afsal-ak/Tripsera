import { Routes, Route } from "react-router-dom";

import CompanyLogin from "@/pages/company/auth/Login";
import CompanySetupPage from "@/pages/company/company-setup/CompanySetupPage";

import CompanyPrivateRoute from "./CompanyPrivateRoute";
import CompanySetupRoute from "./CompanySetupRoute";

import Dashboard from "@/pages/company/dashboard/DashboardPage";
import CompanyProfilePage from "@/pages/company/company-setup/CompanyProfilePage";
import CompanySignup from "@/pages/company/auth/Signup";
import companyPublicRoutes from "./companyPublicRoutes";
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

      {/* Protected (only if setup completed) */}
      <Route element={<CompanyPrivateRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
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

