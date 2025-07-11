import { NavLink } from "react-router-dom";
import { User, Heart, Calendar, Settings, X ,BadgePercent} from "lucide-react";
import { cn } from "@/lib/utils";
 

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: "profile", label: "Profile", icon: User },
  { path: "wishlist", label: "Wishlist", icon: Heart },
    { path: "coupon", label: "Coupon", icon: BadgePercent },
  { path: "bookings", label: "Bookings", icon: Calendar },
];

const AccountSidebar = ({ isOpen, onToggle }: Props) => {
    
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
       className={cn(
    // Mobile: Slide-in fixed
    "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transition-transform duration-300",

    // Slide toggle on mobile
    isOpen ? "translate-x-0" : "-translate-x-full",

    // Desktop: Keep it in flow & sticky under navbar (assumes navbar height is 64px)
    "lg:translate-x-0 lg:sticky lg:top-16 lg:z-10"
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
            {menuItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={`/account/${path}`}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 p-2 rounded-md text-sm font-medium",
                      isActive
                        ? "bg-orange text-white"
                        : "hover:bg-orange/10 hover:text-orange"
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
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AccountSidebar;
