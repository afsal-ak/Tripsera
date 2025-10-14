// import { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import AdminNavbar from '@/components/admin/AdminNavbar';
// import { AdminSidebar } from '@/components/admin/AdminSideBar';
// import { useSelector } from 'react-redux';
// import type { RootState } from '@/redux/store';
// import { useNotificationSocket } from '@/hooks/useNotificationSocket';
// import { useChatRoomsSocket } from '@/hooks/useChatRoomsSocket ';
// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '@/redux/store';
//  import { fetchUserRooms } from '@/redux/slices/chatRoomSlice';
// import { useGlobalSocket } from '@/hooks/useGlobalSocket';


// const AdminLayout = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const adminId = useSelector((state: RootState) => state.adminAuth.admin?._id);

//   if (!adminId) return null;
//   useGlobalSocket(adminId!);

//   useChatRoomsSocket({ currentUserId: adminId });

//   useNotificationSocket(adminId!);
//   useEffect(() => {
//     dispatch(fetchUserRooms({ isAdmin: true }))
//   }, [])
//   const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
//   const [collapsed, setCollapsed] = useState(false); // for desktop collapse

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//   const toggleCollapse = () => setCollapsed(!collapsed);

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <AdminSidebar
//         isOpen={sidebarOpen}
//         onToggle={toggleSidebar}
//         collapsed={collapsed}
//         onCollapse={toggleCollapse}
//       />

//       {/* Main Content */}
//       <div
//         className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'
//           }`}
//       >
//         <AdminNavbar onSidebarToggle={toggleSidebar} title="Admin" />

//         <main className="p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { AdminSidebar } from '@/components/admin/AdminSideBar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { useChatRoomsSocket } from '@/hooks/useChatRoomsSocket ';
import { useGlobalSocket } from '@/hooks/useGlobalSocket';
import { fetchUserRooms } from '@/redux/slices/chatRoomSlice';
import { VideoCallUI } from '@/components/chat/VideoCallUI';

const AdminLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const adminId = useSelector((state: RootState) => state.adminAuth.admin?._id);


  const [incomingCallData, setIncomingCallData] = useState<{
    fromUserId: string;
    roomId: string;
    offer: RTCSessionDescriptionInit;
    fromUserName?: string;
    fromUserAvatar?: string;
    callId?: string;
    callType?: string;
  } | null>(null);


  if (!adminId) return null;


  useGlobalSocket({
    userId: adminId!,
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

  useChatRoomsSocket({ currentUserId: adminId });
  useNotificationSocket(adminId);

  useEffect(() => {
    dispatch(fetchUserRooms({ isAdmin: true }));
  }, [dispatch]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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
        className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
      >
        <AdminNavbar onSidebarToggle={toggleSidebar} title="Admin" />

        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Video Call UI */}
      {adminId && incomingCallData && (
        <VideoCallUI
          currentUserId={adminId}
          remoteUserId={incomingCallData.fromUserId}
          roomId={incomingCallData.roomId}
          incomingCall={incomingCallData}
          onClose={() => setIncomingCallData(null)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
