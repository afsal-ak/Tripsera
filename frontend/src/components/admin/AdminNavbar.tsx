
import { Button } from "@/components/Button";
import { Menu, LogOut, Bell, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleAdminLogout } from "@/services/admin/adminService";
import { logoutAdmin } from "@/redux/slices/adminAuthSlice";
import { useState } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import { useTotalUnreadCount } from "@/hooks/useTotalUnreadCount";

interface AdminNavbarProps {
  onSidebarToggle: () => void;
  title: string;
}

const AdminNavbar = ({ onSidebarToggle, title }: AdminNavbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const adminId = useSelector(
    (state: RootState) => state.adminAuth.admin?._id
  );

  // 🔔 chat unread count (global hook)
  const totalUnread = useTotalUnreadCount(adminId!);

  // 🔔 notifications unread (later from redux, right now hardcoded for demo)
  const notificationUnread = 5;

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

        {/* Right Side - Notifications, Chat & Logout */}
        <div className="flex items-center gap-3 relative">
          <span className="hidden sm:block text-sm text-gray-500">
            Welcome, <span className="font-medium text-gray-700">Admin</span>
          </span>

          {/* 🔔 Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100"
              onClick={() => navigate("/admin/notification")}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {notificationUnread}
                </span>
              )}
            </Button>
          </div>

          {/* 💬 Chat */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100"
              onClick={() => navigate("/admin/chat")}
            >
              <MessageCircle className="h-5 w-5 text-gray-600" />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalUnread}
                </span>
              )}
            </Button>
          </div>

          {/* Full button on sm+ screens */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="hidden sm:flex border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-lg px-4 py-2 text-sm font-medium transition"
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
