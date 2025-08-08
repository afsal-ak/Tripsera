import { Outlet } from 'react-router-dom';
import Navbar from '@/components/user/Navbar';
import Footer from '@/components/user/Footer';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background font-poppins text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
