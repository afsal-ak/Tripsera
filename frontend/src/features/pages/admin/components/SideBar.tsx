
import { useState } from "react";
import { Button } from "@/features/components/Button";
import { cn } from "@/lib/utils";
import { Menu, X, Plus, Table, Edit } from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ isOpen, onToggle, currentPage, onPageChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Table },
    { id: "categories", label: "Categories", icon: Edit },
    { id: "add-category", label: "Add Category", icon: Plus },
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
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out",
        "lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
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
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <Button
                    variant={currentPage === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      currentPage === item.id 
                        ? "bg-orange text-white hover:bg-orange-dark" 
                        : "hover:bg-orange/10 hover:text-orange"
                    )}
                    onClick={() => onPageChange(item.id)}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
