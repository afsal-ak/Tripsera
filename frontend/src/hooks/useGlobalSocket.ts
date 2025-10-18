import { useEffect } from 'react';
import socket from '@/sockets/socket';
import { SOCKET_EVENTS, SOCKET_WEBRTC_EVENTS } from '@/sockets/events';

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
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) socket.connect();

    socket.emit(SOCKET_EVENTS.USER_CONNECTED, { userId });

    const handleOffer = ({
      from,
      offer,
      roomId,
      fromUserName,
      fromUserAvatar,
      callId,
      callType,
    }: any) => {
      console.log('Incoming call OFFER:', { from, offer, roomId, fromUserName, callId });
      onIncomingCall?.(offer, from, roomId, fromUserName, fromUserAvatar, callId, callType);
    };

    socket.on(SOCKET_WEBRTC_EVENTS.OFFER, handleOffer);

    return () => {
      socket.emit(SOCKET_EVENTS.USER_DISCONNECTED, { userId });
      socket.off(SOCKET_WEBRTC_EVENTS.OFFER, handleOffer);
    };
  }, [userId, onIncomingCall]);
}
