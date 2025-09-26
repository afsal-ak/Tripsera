import { Outlet,useLocation } from 'react-router-dom';
import Navbar from '@/components/user/Navbar';
import Footer from '@/components/user/Footer';
import ChatbotLauncher from '@/pages/user/chatbot/ChatbotLauncher';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useChatRoomsSocket } from '@/hooks/useChatRoomsSocket ';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useGlobalSocket } from '@/hooks/useGlobalSocket';
const UserLayout = () => {

  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//for joining notification room so it get notification everywhere
   useGlobalSocket(userId!);

   useNotificationSocket(userId!);
    const location = useLocation();

    const isChatPage = location.pathname.startsWith("/chat");
    const isCheckOutPage = location.pathname.startsWith("/checkout");
const adminPhone = import.meta.env.VITE_ADMIN_PHONE_NUMBER!;
   useChatRoomsSocket({ currentUserId:userId! });
  // useChatSocket({currentUserId})

  return (

    

    <div className="flex flex-col min-h-screen bg-background font-poppins text-foreground">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/*  Hide footer only on chat pages */}
      {!isChatPage && <Footer />}
      {!isChatPage && <ChatbotLauncher />}
      {isCheckOutPage && <WhatsAppButton adminPhone={adminPhone}/>}

    </div>
  );
};

export default UserLayout;
