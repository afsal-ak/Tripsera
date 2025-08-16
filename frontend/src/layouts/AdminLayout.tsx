import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { AdminSidebar } from '@/components/admin/AdminSideBar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [collapsed, setCollapsed] = useState(false); // for desktop collapse

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        collapsed={collapsed}
        onCollapse={toggleCollapse}
      />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <AdminNavbar onSidebarToggle={toggleSidebar} title="Admin" />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
