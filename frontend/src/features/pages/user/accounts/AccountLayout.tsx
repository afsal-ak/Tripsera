import { Outlet } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const AccountLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AccountSidebar isOpen={isOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col lg:pl-4">
        {/* Toggle button for mobile only */}
        <div className="lg:hidden px-4 py-2 border-b bg-white shadow">
          <button
            onClick={toggleSidebar}
            className="text-orange flex items-center gap-2 font-semibold"
          >
            <Menu className="w-5 h-5" />
            Menu
          </button>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
