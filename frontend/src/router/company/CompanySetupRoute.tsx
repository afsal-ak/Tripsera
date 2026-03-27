
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/redux/store";

const CompanySetupRoute = () => {
  const { company, accessToken } = useSelector(
    (state: RootState) => state.companyAuth
  );

  if (!accessToken) {
    return <Navigate to="/company/login" replace />;
  }

  // ✅ If already setup → go dashboard
  if (company?.isSetupComplete) {
    return <Navigate to="/company/dashboard" replace />;
  }

  // 🚀 Allow setup pages
  return <Outlet />;
};

export default CompanySetupRoute;


// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";
// import type { RootState } from "@/redux/store";

// const CompanySetupRoute = () => {
//   const { company } = useSelector((state: RootState) => state.companyAuth);
// console.log(company,'company');

//   if (!company) {
//     return <Navigate to="/company/login" replace />;
//   }

//   if (company.isSetupComplete) {
//     return <Navigate to="/company/dashboard" replace />;
//   }

//   return <Outlet />;
// };

// export default CompanySetupRoute;