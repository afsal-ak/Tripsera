import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/user/Navbar';
import Footer from '@/components/user/Footer';
import ChatbotLauncher from '@/pages/user/chatbot/ChatbotLauncher';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { useSelector  } from 'react-redux';
import type {  RootState } from '@/redux/store';
import { useState } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useGlobalSocket } from '@/hooks/useGlobalSocket';
import { VideoCallUI } from '@/components/chat/VideoCallUI';
 import { useAuthModal } from '@/context/AuthModalContext';
import LoginModal from '@/pages/user/auth/LoginModal';

const UserLayout = () => {
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
const { isOpen, closeLogin } = useAuthModal();
  const [incomingCallData, setIncomingCallData] = useState<{
    fromUserId: string;
    roomId: string;
    offer: RTCSessionDescriptionInit;
    fromUserName?: string;
    fromUserAvatar?: string;
    callId?: string;
    callType?: string;
  } | null>(null);

  useGlobalSocket({
    userId: userId!,
    onIncomingCall: (offer, fromUserId, roomId, fromUserName, fromUserAvatar, callId, callType) => {
      setIncomingCallData({
        offer,
        fromUserId,
        roomId,
        fromUserName,
        fromUserAvatar,
        callId,
        callType,
      });
    },
  });

  // useChatRoomsSocket({ currentUserId: userId! });
  useNotificationSocket(userId!);

  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat');
  const isCheckOutPage = location.pathname.startsWith('/checkout');
  const adminPhone = import.meta.env.VITE_ADMIN_PHONE_NUMBER!;

  // useEffect(() => {
  //   dispatch(fetchUserRooms({ isAdmin: false }));
  // }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-background font-poppins text-foreground">
      <Navbar />

      {/* <main className="flex-1">
        <Outlet />
      </main> */}
      <main className="flex-1 flex flex-col justify-between">
        <Outlet />
      </main>

      {!isChatPage && <Footer />}
      {!isChatPage && <ChatbotLauncher />}
      {/* {isCheckOutPage && <WhatsAppButton adminPhone={adminPhone} />} */}

      {/* Video Call UI */}
      {userId && incomingCallData && (
        <VideoCallUI
          currentUserId={userId}
          remoteUserId={incomingCallData.fromUserId}
          roomId={incomingCallData.roomId}
          incomingCall={incomingCallData}
          onClose={() => setIncomingCallData(null)}
        />
      )}

    {isOpen && (
 <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
<div className="
  w-full
  max-w-lg        /* desktop width */
  sm:max-w-xl
  lg:max-w-3xl
  max-h-[90vh]
  overflow-y-auto
  bg-white
  rounded-2xl
  relative
">      
      <button
        onClick={closeLogin}
        className="absolute top-3 right-3 text-gray-500 text-xl"
      >
        ✕
      </button>

      <LoginModal />
    </div>
  </div>
)}
    </div>
  );
};

export default UserLayout;
