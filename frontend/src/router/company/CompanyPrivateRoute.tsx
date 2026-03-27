import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/redux/store";
const CompanyPrivateRoute = () => {
  const { accessToken, company } = useSelector(
    (state: RootState) => state.companyAuth
  );

  if (!accessToken) {
    return <Navigate to="/company/login" replace />;
  }

  // 🚀 If setup NOT complete → force setup page
  if (!company?.isSetupComplete) {
    return <Navigate to="/company/setup" replace />;
  }

  // ✅ Setup done → allow access (dashboard etc)
  return <Outlet />;
};

export default CompanyPrivateRoute;


// const CompanyPrivateRoute = () => {
//   const accessToken = useSelector(
//     (state: RootState) => state.companyAuth.accessToken
//   );
//   const { company } = useSelector((state: RootState) => state.companyAuth);
   
// console.log(company,'company');

//   if (company?.isSetupComplete) {
//     return <Navigate to="/company/dashboard" replace />;
//   }
//   return accessToken ? <Outlet /> : <Navigate to="/company/login" replace />;
// };

// export default CompanyPrivateRoute;

 