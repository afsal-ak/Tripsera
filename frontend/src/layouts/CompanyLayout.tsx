import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
  import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { useChatRoomsSocket } from '@/hooks/useChatRoomsSocket ';
import { useGlobalSocket } from '@/hooks/useGlobalSocket';
 import { VideoCallUI } from '@/components/chat/VideoCallUI';
import { CompanySidebar } from '@/components/company/CompanySideBar';
import CompanyNavbar from '@/components/company/CompanyNavbar';

const CompanyLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.companyAuth.company);
console.log(company,'companay in company layout');
const companyId=company?.companyId
  const [incomingCallData, setIncomingCallData] = useState<{
    fromUserId: string;
    roomId: string;
    offer: RTCSessionDescriptionInit;
    fromUserName?: string;
    fromUserAvatar?: string;
    callId?: string;
    callType?: string;
  } | null>(null);

  if (!companyId) return null;

  useGlobalSocket({
    userId: companyId!,
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

  //useChatRoomsSocket({ currentUserId: adminId });
  useNotificationSocket(companyId);

  // useNotificationSocket(adminId);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <CompanySidebar
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
        <CompanyNavbar onSidebarToggle={toggleSidebar} title="Admin" />

        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Video Call UI */}
      {companyId && incomingCallData && (
        <VideoCallUI
          currentUserId={companyId}
          remoteUserId={incomingCallData.fromUserId}
          roomId={incomingCallData.roomId}
          incomingCall={incomingCallData}
          onClose={() => setIncomingCallData(null)}
        />
      )}
    </div>
  );
};

export default CompanyLayout;
