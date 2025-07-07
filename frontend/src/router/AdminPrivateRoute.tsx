
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/redux/store";

const AdminPrivateRoute = () => {
  const accessToken = useSelector((state: RootState) => state.adminAuth.accessToken);

  return accessToken ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;
