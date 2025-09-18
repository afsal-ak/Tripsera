// import { useEffect, useState } from "react";
// import socket from "@/sockets/socket";
// import { SOCKET_NOTIFICATION_EVENTS } from "@/sockets/events";
// import { fetchNotification } from "@/services/user/notificationsService";
// export const Notifications = ({ userId }: { userId: string }) => {
//   const [notifications, setNotifications] = useState<any[]>([]);

//   useEffect(()=>{
//     const fetch=async()=>{
//         try {
//             const response=await fetchNotification()
//             console.log(response.result.notification,'notification')
//             setNotifications(response.result.notification)
//         } catch (error) {
//             console.log(error,'notification errro')
//         }
//     }
//     fetch()
//   },[])
//   useEffect(() => {
//     // join user-specific room for notifications
//     socket.emit(SOCKET_NOTIFICATION_EVENTS.JOIN, userId);

//     // listen for new notifications
//     socket.on(SOCKET_NOTIFICATION_EVENTS.NEW, (notification:any) => {
//       console.log("🔔 New notification:", notification);
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     // fetch old notifications
//     socket.emit(SOCKET_NOTIFICATION_EVENTS.FETCH, { userId, page: 1, limit: 10 });

//     socket.on(SOCKET_NOTIFICATION_EVENTS.FETCH_RESULT, ({ notification }) => {
//         console.log(notification,'ddddd')
//       setNotifications(notification);
//     });

//     return () => {
//       socket.off("notification:new");
//       socket.off("notification:fetch_result");
//     };
//   }, [userId]);

//   return (
//     <div>
//       <h3>Notifications</h3>
//       <ul>
//         {notifications.map((n) => (
//           <li key={n._id}>
//             {n.title}: {n.message}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
// src/pages/NotificationPage.tsx
import { useState,useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { fetchNotification } from "@/services/user/notificationsService";
import type { INotification } from "@/types/INotifications";
import type{ RootState } from "@/redux/store";
import { useSelector } from "react-redux";
const NotificationPage = () => {
    
const userId=useSelector((state:RootState)=>state.userAuth.user?._id)
  const { notifications } = useNotifications(userId!,'user');
   //const [notification, setNotification] = useState<INotification[]>([]);

  //   useEffect(()=>{
  //   const fetch=async()=>{
  //       try {
  //           const response=await fetchNotification()
  //           console.log(response.result.notification,'notification')
  //           setNotification(response.result.notification)
  //       } catch (error) {
  //           console.log(error,'notification errro')
  //       }
  //   }
  //   fetch()
  // },[])
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li
            key={n._id}
            className="border rounded-lg p-3 shadow-sm hover:bg-gray-50"
          >
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-gray-600">{n.message}</p>
            <p className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
