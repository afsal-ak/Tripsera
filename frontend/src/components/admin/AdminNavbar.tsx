import { Button } from "@/components/Button";
import { Menu, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleAdminLogout } from "@/services/admin/adminService";
import { logoutAdmin } from "@/redux/slices/adminAuthSlice";

interface AdminNavbarProps {
  onSidebarToggle: () => void;
  title: string;
}

const AdminNavbar = ({ onSidebarToggle, title }: AdminNavbarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await handleAdminLogout();
      dispatch(logoutAdmin());
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (err: any) {
      toast.error(err.message || "Logout failed");
      console.error("Logout Error:", err);
    }
  };

  return (
    <header className="bg-white shadow-md border-b sticky top-0 z-30">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left Side - Toggle + Title */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle (visible on mobile only) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden rounded-full hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
          <h1 className="text-base sm:text-xl font-semibold text-gray-800 truncate">
            {title}
          </h1>
        </div>

        {/* Right Side - Info + Logout */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-500">
            Welcome, <span className="font-medium text-gray-700">Admin</span>
          </span>

          {/* Full button on sm+ screens */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="hidden sm:flex border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-orange rounded-lg px-4 py-2 text-sm font-medium transition"
          >
            Logout
          </Button>

          {/* Icon only on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="sm:hidden text-orange-500 hover:bg-orange-100 rounded-full"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
