import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/redux/store";

interface Props {
  allowAdmin?: boolean;
  allowCompany?: boolean;
}

const MultiRoleRoute = ({ allowAdmin, allowCompany }: Props) => {
  const adminToken = useSelector(
    (state: RootState) => state.adminAuth.accessToken
  );

  const companyToken = useSelector(
    (state: RootState) => state.companyAuth.accessToken
  );

  // ✅ Admin access
  if (allowAdmin && adminToken) {
    return <Outlet />;
  }

  // ✅ Company access
  if (allowCompany && companyToken) {
    return <Outlet />;
  }

  // ❌ No access
  return <Navigate to="/unauthorized" replace />;
};

export default MultiRoleRoute;