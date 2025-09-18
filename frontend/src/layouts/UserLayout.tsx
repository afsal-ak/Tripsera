import { Outlet,useLocation } from 'react-router-dom';
import Navbar from '@/components/user/Navbar';
import Footer from '@/components/user/Footer';
import ChatbotLauncher from '@/pages/user/chatbot/ChatbotLauncher';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
const UserLayout = () => {

  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//for joining notification room so it get notification everywhere
   useNotificationSocket(userId!);
    const location = useLocation();

    const isChatPage = location.pathname.startsWith("/chat");

  return (

    

    <div className="flex flex-col min-h-screen bg-background font-poppins text-foreground">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/*  Hide footer only on chat pages */}
      {!isChatPage && <Footer />}
      {!isChatPage && <ChatbotLauncher />}

    </div>
  );
};

export default UserLayout;
