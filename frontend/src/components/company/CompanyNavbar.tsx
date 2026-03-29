import { Button } from '@/components/Button';
import { Menu, LogOut, Bell, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleAdminLogout } from '@/services/admin/adminService';
import { logoutAdmin } from '@/redux/slices/adminAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { useTotalUnreadCount } from '@/hooks/useTotalUnreadCount';
import { EnumUserRole } from '@/Constants/enums/userEnum';
import { handleCompanyLogout } from '@/services/company/companyAuthService';

interface CompanyNavbarProps {
  onSidebarToggle: () => void;
  title: string;
}

const CompanyNavbar = ({ onSidebarToggle, title }: CompanyNavbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const Company = useSelector((state: RootState) => state.companyAuth.company?._id);
  const notificationUnread = useSelector((state: RootState) => state.notifications.unreadCount);
  const totalChatUnread = useTotalUnreadCount(EnumUserRole.COMPANY);
  console.log(notificationUnread, 'notifica');

  // const totalChatUnread = useTotalUnreadCount(user?._id!);
  console.log(totalChatUnread,'totalChatUnread');
  const handleLogout = async () => {
    try {
      await handleCompanyLogout();
      dispatch(logoutAdmin());
      toast.success('Logged out successfully');
      navigate('/company/login');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
      console.error('Logout Error:', err);
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
          <h1 className="text-base sm:text-xl font-semibold text-gray-800 truncate">{title}</h1>
        </div>

        {/* Right Side - Notifications, Chat & Logout */}
        <div className="flex items-center gap-3 relative">
          <span className="hidden sm:block text-sm text-gray-500">
            Welcome, <span className="font-medium text-gray-700">Company Admin</span>
          </span>

          {/* 🔔 Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100"
              onClick={() => navigate('/company/notification')}
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
              onClick={() => navigate('/company/chat')}
            >
              <MessageCircle className="h-5 w-5 text-gray-600" />
              {totalChatUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalChatUnread}
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

export default CompanyNavbar;
