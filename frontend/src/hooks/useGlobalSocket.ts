// // import { useEffect } from 'react';
// // import socket from '@/sockets/socket';
// // import { SOCKET_EVENTS, SOCKET_WEBRTC_EVENTS } from '@/sockets/events';

// // interface UseGlobalSocketProps {
// //   userId: string;
// //   onIncomingCall?: (
// //     offer: RTCSessionDescriptionInit,
// //     fromUserId: string,
// //     roomId: string,
// //     fromUserName?: string,
// //     fromUserAvatar?: string,
// //     callId?: string,
// //     callType?: string
// //   ) => void;
// // }

// // export function useGlobalSocket({ userId, onIncomingCall }: UseGlobalSocketProps) {
// //   useEffect(() => {
// //     if (!userId) return;

// //     if (!socket.connected) socket.connect();

// //     socket.emit(SOCKET_EVENTS.USER_CONNECTED, { userId });

// //     const handleOffer = ({
// //       from,
// //       offer,
// //       roomId,
// //       fromUserName,
// //       fromUserAvatar,
// //       callId,
// //       callType,
// //     }: any) => {
// //       console.log('Incoming call OFFER:', { from, offer, roomId, fromUserName, callId });
// //       onIncomingCall?.(offer, from, roomId, fromUserName, fromUserAvatar, callId, callType);
// //     };

// //     socket.on(SOCKET_WEBRTC_EVENTS.OFFER, handleOffer);

// //     return () => {
// //       socket.emit(SOCKET_EVENTS.USER_DISCONNECTED, { userId });
// //       socket.off(SOCKET_WEBRTC_EVENTS.OFFER, handleOffer);
// //     };
// //   }, [userId, onIncomingCall]);
// // }
// import { useEffect } from 'react';
// import socket from '@/sockets/socket';
// import { SOCKET_EVENTS, SOCKET_WEBRTC_EVENTS } from '@/sockets/events';
// import { useDispatch } from 'react-redux';
// import { incrementTotalUnread, updateRoomOnNewMessage } from '@/redux/slices/chatRoomSlice';
// import type{ IMessage } from '@/types/IMessage';
// interface UseGlobalSocketProps {
//   userId: string;
//   onIncomingCall?: (
//     offer: RTCSessionDescriptionInit,
//     fromUserId: string,
//     roomId: string,
//     fromUserName?: string,
//     fromUserAvatar?: string,
//     callId?: string,
//     callType?: string
//   ) => void;
// }

// export function useGlobalSocket({ userId, onIncomingCall }: UseGlobalSocketProps) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!userId) return;

//     if (!socket.connected) socket.connect();

//     //  Register user
//     socket.emit(SOCKET_EVENTS.USER_CONNECTED, { userId });

//     //  Handle new message globally
//     const handleNewMessage = (message: IMessage) => {
//       console.log('📩 Global new message received:', message);

//       //  Update specific chat room data
     

//       //  Increment global unread if it's not from this user
//       if (message.senderId._id !== userId) {
//         dispatch(incrementTotalUnread());
//       }
//     };

//     socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);

//     //  Handle incoming call
//     const handleOffer = ({
//       from,
//       offer,
//       roomId,
//       fromUserName,
//       fromUserAvatar,
//       callId,
//       callType,
//     }: any) => {
//       console.log(' Incoming call OFFER:', { from, offer, roomId });
//       onIncomingCall?.(offer, from, roomId, fromUserName, fromUserAvatar, callId, callType);
//     };

//     socket.on(SOCKET_WEBRTC_EVENTS.OFFER, handleOffer);

//     //  Cleanup
//     return () => {
//       socket.emit(SOCKET_EVENTS.USER_DISCONNECTED, { userId });
//       socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
//       socket.off(SOCKET_WEBRTC_EVENTS.OFFER, handleOffer);
//     };
//   }, [userId, onIncomingCall, dispatch]);
// }
import { useEffect } from 'react';
import socket from '@/sockets/socket';
import { SOCKET_EVENTS, SOCKET_WEBRTC_EVENTS } from '@/sockets/events';
import { useDispatch, useSelector } from 'react-redux';
import {
  incrementTotalUnread,
  updateRoomOnNewMessage,
} from '@/redux/slices/chatRoomSlice';
import type { IMessage } from '@/types/IMessage';
import type { RootState } from '@/redux/store';

interface UseGlobalSocketProps {
  userId: string;
  onIncomingCall?: (
    offer: RTCSessionDescriptionInit,
    fromUserId: string,
    roomId: string,
    fromUserName?: string,
    fromUserAvatar?: string,
    callId?: string,
    callType?: string
  ) => void;
}

export function useGlobalSocket({ userId, onIncomingCall }: UseGlobalSocketProps) {
  const dispatch = useDispatch();
  const activeRoomId = useSelector((state: RootState) => state.chatRoom.activeRoomId);

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) socket.connect();

    // register user with socket
    socket.emit(SOCKET_EVENTS.USER_CONNECTED, { userId });

    //  Handle new message globally
    const handleNewMessage = (message: IMessage) => {
      console.log(' Global new message received:', message);

      //  update that chat room’s data in Redux
      dispatch(
        updateRoomOnNewMessage({
          roomId: message.roomId,
          message,
          currentUserId: userId,
        })
      );

     
      // - Message not sent by me
      // - User is NOT currently inside that room
      if (message.senderId._id !== userId && message.roomId !== activeRoomId) {
        dispatch(incrementTotalUnread());
      }
    };

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);

    //  Handle incoming call (WebRTC offer)
    const handleOffer = ({
      from,
      offer,
      roomId,
      fromUserName,
      fromUserAvatar,
      callId,
      callType,
    }: any) => {
      console.log(' Incoming call OFFER:', { from, offer, roomId });
      onIncomingCall?.(offer, from, roomId, fromUserName, fromUserAvatar, callId, callType);
    };

    socket.on(SOCKET_WEBRTC_EVENTS.OFFER, handleOffer);


    return () => {
      socket.emit(SOCKET_EVENTS.USER_DISCONNECTED, { userId });
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_WEBRTC_EVENTS.OFFER, handleOffer);
    };
  }, [userId, onIncomingCall, dispatch, activeRoomId]);
}
