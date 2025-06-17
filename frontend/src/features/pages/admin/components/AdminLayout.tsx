import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSideBar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="flex-1 lg:ml-0">
          <AdminNavbar onSidebarToggle={toggleSidebar} title="Admin" />
          <main className="p-6">
            <Outlet /> {/* this renders nested page */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
