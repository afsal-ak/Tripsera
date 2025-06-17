import { Button } from "@/features/components/Button";
import { cn } from "@/lib/utils";
import { Menu, X, Plus, Table, Edit } from "lucide-react";
import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const menuItems = [
    { path: "dashboard", label: "Dashboard", icon: Table },
    { path: "users", label: "Users", icon: Table },
    { path: "categories", label: "Categories", icon: Table },
     { path: "categories/add", label: "Add Category", icon: Plus },

    { path: "banners", label: "Banners", icon: Table },
    { path: "packages", label: "Packages", icon: Table },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-orange">Admin Panel</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden"
          >
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
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                      isActive
                        ? "bg-orange text-white"
                        : "hover:bg-orange/10 hover:text-orange"
                    )
                  }
                  onClick={onToggle}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
