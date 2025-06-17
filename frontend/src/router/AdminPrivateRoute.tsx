//  import { Navigate, Outlet } from "react-router-dom";

// const AdminPrivateRoute = () => {
//   const token = localStorage.getItem("adminAccessToken");

//   return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
// };

// export default AdminPrivateRoute;
// features/pages/admin/components/AdminPrivateRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/redux/store";

const AdminPrivateRoute = () => {
  const accessToken = useSelector((state: RootState) => state.adminAuth.accessToken);

  return accessToken ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;
