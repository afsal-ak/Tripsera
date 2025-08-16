// import { Button } from '@/components/Button';
// import { cn } from '@/lib/utils';
// import {
//   LayoutDashboard,
//   X,
//   Table,
//   User,
//   Image,
//   Briefcase,
//   FolderKanban,
//   BadgePercent,
// } from 'lucide-react';
// import { NavLink } from 'react-router-dom';

// interface AdminSidebarProps {
//   isOpen: boolean;
//   onToggle: () => void;
// }

// const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
//   const menuItems = [
//     { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
//     { path: 'users', label: 'Users', icon: User },
//     { path: 'categories', label: 'Categories', icon: FolderKanban },
//     { path: 'banners', label: 'Banners', icon: Image },
//     { path: 'packages', label: 'Packages', icon: Briefcase },
//     { path: 'coupons', label: 'Coupons', icon: BadgePercent },
//     { path: 'bookings', label: 'Bookings', icon: Table },
//     { path: 'blogs', label: 'Blogs', icon: Table },
//     { path: 'reviews', label: 'Reviews', icon: Table },
//     { path: 'referral', label: 'Referral', icon: Table },
//     { path: 'sales-report', label: 'Sales Report', icon: Table },
//     { path: 'reports', label: 'Report', icon: Table },
//   ];
//    return (
//     <>
//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={cn(
//           'fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out',
//           isOpen ? 'translate-x-0' : '-translate-x-full',
//           'lg:translate-x-0'
//         )}
//       >
//         {/* Sidebar Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-xl font-bold text-orange">Admin Panel</h2>
//           <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden">
//             <X className="h-5 w-5" />
//           </Button>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4">
//           <ul className="space-y-2">
//             {menuItems.map(({ path, label, icon: Icon }) => (
//               <li key={path}>
//                 <NavLink
//                   to={`/admin/${path}`}
//                   className={({ isActive }) =>
//                     cn(
//                       'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
//                       isActive ? 'bg-orange text-white' : 'hover:bg-orange/10 hover:text-orange'
//                     )
//                   }
//                   onClick={() => {
//                     // Close sidebar only on mobile
//                     if (window.innerWidth < 1024) onToggle();
//                   }}
//                 >
//                   <Icon className="h-4 w-4" />
//                   {label}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default AdminSidebar;

import { NavLink } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  User,
  Image,
  Briefcase,
  FolderKanban,
  BadgePercent,
  Calendar,
  BookOpen,
  Star,
  Gift,
  FileBarChart,
  Flag,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  collapsed: boolean;
  onCollapse: () => void;
}

export const AdminSidebar = ({
  isOpen,
  onToggle,
  collapsed,
  onCollapse,
}: AdminSidebarProps) => {
  const isMobile = window.innerWidth < 1024;

  const mainItems = [
    { path: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "categories", label: "Categories", icon: FolderKanban },
    { path: "banners", label: "Banners", icon: Image },
    { path: "packages", label: "Packages", icon: Briefcase },
    { path: "coupons", label: "Coupons", icon: BadgePercent },
  ];

  const userManagementItems = [
    { path: "users", label: "Users", icon: User },
    { path: "reviews", label: "Reviews", icon: Star },
  ];

  const bookingItems = [
    { path: "bookings", label: "Bookings", icon: Calendar },
    { path: "blogs", label: "Blogs", icon: BookOpen },
    { path: "referral", label: "Referral", icon: Gift },
    { path: "sales-report", label: "Sales Report", icon: FileBarChart },
    { path: "reports", label: "Reports", icon: Flag }, // spam/abuse reports
  ];

  const renderMenuGroup = (title: string, items: typeof mainItems) => (
    <div className="mb-4">
      {!collapsed && (
        <h3 className="text-xs font-medium text-muted-foreground uppercase px-3 mb-1">
          {title}
        </h3>
      )}
      <ul className="space-y-1">
        {items.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={`/admin/${path}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange text-white"
                    : "hover:bg-orange/10 hover:text-orange"
                )
              }
              onClick={() => {
                if (isMobile) onToggle();
              }}
            >
              <Icon className="w-4 h-4" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-20" : "w-64",
          "lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <h2 className="text-xl font-bold text-orange">Admin Panel</h2>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Collapse button (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCollapse}
              className="hidden lg:flex"
            >
              {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          {renderMenuGroup("Main", mainItems)}
          {renderMenuGroup("User Management", userManagementItems)}
          {renderMenuGroup("Bookings & Reports", bookingItems)}
        </nav>

        {/* Footer / Settings */}
        <div className="p-4 border-t">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange text-white"
                  : "hover:bg-orange/10 hover:text-orange"
              )
            }
          >
            <Settings className="w-4 h-4" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
};
