import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  User,
  Heart,
  Calendar,
  X,
  BadgePercent,
  Wallet,
  IdCard,
  List,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: 'profile', label: 'Profile', icon: User },
  { path: 'wishlist', label: 'Wishlist', icon: Heart },
  { path: 'coupon', label: 'Coupon', icon: BadgePercent },
  { path: 'wallet', label: 'Wallet', icon: Wallet },
  { path: 'my-bookings', label: 'My Bookings', icon: Calendar },
  { path: 'my-blogs', label: 'My Blogs', icon: IdCard },
  { path: 'my-reviews', label: 'My Reviews', icon: List },
  {
    label: 'My Custom Package',
    icon: List,
    subItems: [
      { path: 'my-custom-package', label: 'Requested Packages' },
      { path: 'my-custom-package/user', label: 'Approved Packages' },
    ],
  },
];

const AccountSidebar = ({ isOpen, onToggle }: Props) => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  // ✅ Automatically open submenu if current path matches any of its sub-items
  useEffect(() => {
    const matchedMenu = menuItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((sub) => location.pathname.includes(sub.path))
    );
    setOpenSubMenu(matchedMenu ? matchedMenu.label : null);
  }, [location.pathname]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:sticky lg:top-16 lg:z-10'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">My Account</h2>
          <button className="lg:hidden" onClick={onToggle}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(({ path, label, icon: Icon, subItems }) =>
              subItems ? (
                <li key={label}>
                  <button
                    onClick={() => toggleSubMenu(label)}
                    className={cn(
                      'flex items-center justify-between w-full p-2 rounded-md text-sm font-medium transition-colors',
                      openSubMenu === label
                        ? 'bg-orange text-white'
                        : 'hover:bg-orange/10 hover:text-orange'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                    {openSubMenu === label ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {openSubMenu === label && (
                    <ul className="ml-8 mt-2 space-y-1 border-l border-border pl-3">
                      {subItems.map((sub) => (
                        <li key={sub.path}>
                          <NavLink
                            to={`/account/${sub.path}`}
                            end
                            className={({ isActive }) =>
                              cn(
                                'block p-2 text-sm rounded-md transition-colors',
                                isActive
                                  ? 'bg-orange text-white'
                                  : 'hover:bg-orange/10 hover:text-orange'
                              )
                            }
                            onClick={() => {
                              if (window.innerWidth < 1024) onToggle();
                            }}
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={path}>
                  <NavLink
                    to={`/account/${path}`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-orange text-white'
                          : 'hover:bg-orange/10 hover:text-orange'
                      )
                    }
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle();
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AccountSidebar;
