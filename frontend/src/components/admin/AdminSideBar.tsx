import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  X,
  Table,
  User,
  Image,
  Briefcase,
  FolderKanban,
  BadgePercent,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const menuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: 'users', label: 'Users', icon: User },
    { path: 'categories', label: 'Categories', icon: FolderKanban },
    { path: 'banners', label: 'Banners', icon: Image },
    { path: 'packages', label: 'Packages', icon: Briefcase },
    { path: 'coupons', label: 'Coupons', icon: BadgePercent },
    { path: 'bookings', label: 'Bookings', icon: Table },
    { path: 'blogs', label: 'Blogs', icon: Table },
    { path: 'reviews', label: 'Reviews', icon: Table },
    { path: 'referral', label: 'Referral', icon: Table },
    { path: 'sales-report', label: 'Sales Report', icon: Table },
    { path: 'reports', label: 'Report', icon: Table },
  ];
   return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-orange">Admin Panel</h2>
          <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={`/admin/${path}`}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
                      isActive ? 'bg-orange text-white' : 'hover:bg-orange/10 hover:text-orange'
                    )
                  }
                  onClick={() => {
                    // Close sidebar only on mobile
                    if (window.innerWidth < 1024) onToggle();
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
