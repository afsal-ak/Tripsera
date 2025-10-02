import { Outlet,useLocation } from 'react-router-dom';
import Navbar from '@/components/user/Navbar';
import Footer from '@/components/user/Footer';
import ChatbotLauncher from '@/pages/user/chatbot/ChatbotLauncher';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { useSelector,useDispatch } from 'react-redux';
import type {AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useChatRoomsSocket } from '@/hooks/useChatRoomsSocket ';
import { useGlobalSocket } from '@/hooks/useGlobalSocket';
import { fetchUserRooms } from '@/redux/slices/chatRoomSlice';
const UserLayout = () => {

  const dispatch=useDispatch<AppDispatch>()
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//for joining notification room so it get notification everywhere
   useGlobalSocket(userId!);
   useChatRoomsSocket({ currentUserId:userId! });

   useNotificationSocket(userId!);

    const location = useLocation();

    const isChatPage = location.pathname.startsWith("/chat");
    const isCheckOutPage = location.pathname.startsWith("/checkout");
const adminPhone = import.meta.env.VITE_ADMIN_PHONE_NUMBER!;
 useEffect(()=>{
dispatch(fetchUserRooms({isAdmin:false}))
},[])
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
