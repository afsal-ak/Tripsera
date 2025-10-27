import { NavLink } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  collapsed: boolean;
  onCollapse: () => void;
}

export const AdminSidebar = ({ isOpen, onToggle, collapsed, onCollapse }: AdminSidebarProps) => {
  const isMobile = window.innerWidth < 1024;
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const mainItems = [
    { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: 'categories', label: 'Categories', icon: FolderKanban },
    { path: 'banners', label: 'Banners', icon: Image },
    { path: 'packages', label: 'Packages', icon: Briefcase },
    { path: 'coupons', label: 'Coupons', icon: BadgePercent },

    {
      label: 'Custom Packages',
      icon: Briefcase,
      children: [
        { path: 'custom-packages', label: 'Requested Packages' },
        { path: 'custom-packages/approved', label: 'Approved Packages' },
      ],
    },
  ];

  const userManagementItems = [
    { path: 'users', label: 'Users', icon: User },
    { path: 'reviews', label: 'Reviews', icon: Star },
  ];

  const bookingItems = [
    { path: 'bookings', label: 'Bookings', icon: Calendar },
    { path: 'blogs', label: 'Blogs', icon: BookOpen },
    { path: 'referral', label: 'Referral', icon: Gift },
    { path: 'sales-report', label: 'Sales Report', icon: FileBarChart },
    { path: 'reports', label: 'Reports', icon: Flag },
  ];

  const renderMenuGroup = (title: string, items: typeof mainItems) => (
    <div className="mb-4">
      {!collapsed && (
        <h3 className="text-xs font-medium text-muted-foreground uppercase px-3 mb-1">{title}</h3>
      )}
      <ul className="space-y-1">
        {items.map(({ path, label, icon: Icon, children }) =>
          children ? (
            <li key={label}>
              <button
                onClick={() => toggleSubmenu(label)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  openMenus[label]
                    ? 'bg-orange/10 text-orange'
                    : 'hover:bg-orange/10 hover:text-orange'
                )}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="w-4 h-4" />}
                  {!collapsed && <span>{label}</span>}
                </div>
                {!collapsed &&
                  (openMenus[label] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  ))}
              </button>

              {/* Submenu */}
              {openMenus[label] && !collapsed && (
                <ul className="ml-9 mt-1 space-y-1">
                  {children.map((child) => (
                    <li key={child.path}>
                      <NavLink
                        to={`/admin/${child.path}`}
                        className={({ isActive }) =>
                          cn(
                            'block px-3 py-1.5 rounded-md text-sm transition-colors',
                            isActive
                              ? 'bg-orange text-white'
                              : 'hover:bg-orange/10 hover:text-orange'
                          )
                        }
                        onClick={() => {
                          if (isMobile) onToggle();
                        }}
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li key={path}>
              <NavLink
                to={`/admin/${path}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive ? 'bg-orange text-white' : 'hover:bg-orange/10 hover:text-orange'
                  )
                }
                onClick={() => {
                  if (isMobile) onToggle();
                }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          )
        )}
      </ul>
    </div>
  );

  return (
    <>
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-20' : 'w-64',
          'lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            {!collapsed && <h2 className="text-xl font-bold text-orange">Admin Panel</h2>}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onCollapse} className="hidden lg:flex">
              {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          {renderMenuGroup('Main', mainItems)}
          {renderMenuGroup('User Management', userManagementItems)}
          {renderMenuGroup('Bookings & Reports', bookingItems)}
        </nav>

        <div className="p-4 border-t">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive ? 'bg-orange text-white' : 'hover:bg-orange/10 hover:text-orange'
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

// import { NavLink } from 'react-router-dom';
// import {
//   X,
//   LayoutDashboard,
//   User,
//   Image,
//   Briefcase,
//   FolderKanban,
//   BadgePercent,
//   Calendar,
//   BookOpen,
//   Star,
//   Gift,
//   FileBarChart,
//   Flag,
//   Settings,
//   Menu,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/Button';

// interface AdminSidebarProps {
//   isOpen: boolean;
//   onToggle: () => void;
//   collapsed: boolean;
//   onCollapse: () => void;
// }

// export const AdminSidebar = ({ isOpen, onToggle, collapsed, onCollapse }: AdminSidebarProps) => {
//   const isMobile = window.innerWidth < 1024;

//   const mainItems = [
//     { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
//     { path: 'categories', label: 'Categories', icon: FolderKanban },
//     { path: 'banners', label: 'Banners', icon: Image },
//     { path: 'packages', label: 'Packages', icon: Briefcase },
//     { path: 'coupons', label: 'Coupons', icon: BadgePercent },
//     { path: 'custom-packages', label: 'Custom Packages Requested', icon: Briefcase },
//     { path: 'custom-packages/approved', label: 'Custom Packages Approved', icon: Briefcase },
//     // { path: "chat", label: "Chat", icon: MessageCircle },
//     // { path: "notification", label: "Notification", icon: NotebookIcon },
//   ];
 
//   const userManagementItems = [
//     { path: 'users', label: 'Users', icon: User },
//     { path: 'reviews', label: 'Reviews', icon: Star },
//   ];

//   const bookingItems = [
//     { path: 'bookings', label: 'Bookings', icon: Calendar },
//     { path: 'blogs', label: 'Blogs', icon: BookOpen },
//     { path: 'referral', label: 'Referral', icon: Gift },
//     { path: 'sales-report', label: 'Sales Report', icon: FileBarChart },
//     { path: 'reports', label: 'Reports', icon: Flag }, // spam/abuse reports
//   ];

//   const renderMenuGroup = (title: string, items: typeof mainItems) => (
//     <div className="mb-4">
//       {!collapsed && (
//         <h3 className="text-xs font-medium text-muted-foreground uppercase px-3 mb-1">{title}</h3>
//       )}
//       <ul className="space-y-1">
//         {items.map(({ path, label, icon: Icon }) => (
//           <li key={path}>
//             <NavLink
//               to={`/admin/${path}`}
//               className={({ isActive }) =>
//                 cn(
//                   'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
//                   isActive ? 'bg-orange text-white' : 'hover:bg-orange/10 hover:text-orange'
//                 )
//               }
//               onClick={() => {
//                 if (isMobile) onToggle();
//               }}
//             >
//               <Icon className="w-4 h-4" />
//               {!collapsed && <span>{label}</span>}
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {isOpen && isMobile && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={cn(
//           'fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 flex flex-col',
//           isOpen ? 'translate-x-0' : '-translate-x-full',
//           collapsed ? 'w-20' : 'w-64',
//           'lg:translate-x-0'
//         )}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
//               <Briefcase className="w-4 h-4 text-white" />
//             </div>
//             {!collapsed && <h2 className="text-xl font-bold text-orange">Admin Panel</h2>}
//           </div>
//           <div className="flex items-center gap-1">
//             {/* Collapse button (desktop) */}
//             <Button variant="ghost" size="icon" onClick={onCollapse} className="hidden lg:flex">
//               {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
//             </Button>
//             {/* Mobile close button */}
//             <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden">
//               <X className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 flex-1 overflow-y-auto">
//           {renderMenuGroup('Main', mainItems)}
//           {renderMenuGroup('User Management', userManagementItems)}
//           {renderMenuGroup('Bookings & Reports', bookingItems)}
//         </nav>

//         {/* Footer / Settings */}
//         <div className="p-4 border-t">
//           <NavLink
//             to="/admin/settings"
//             className={({ isActive }) =>
//               cn(
//                 'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
//                 isActive ? 'bg-orange text-white' : 'hover:bg-orange/10 hover:text-orange'
//               )
//             }
//           >
//             <Settings className="w-4 h-4" />
//             {!collapsed && <span>Settings</span>}
//           </NavLink>
//         </div>
//       </aside>
//     </>
//   );
// };
