import { useRef, useState, useCallback, useEffect } from "react";
import socket from "@/sockets/socket";
import { SOCKET_WEBRTC_EVENTS } from "@/sockets/events";

interface UseWebRTCProps {
  currentUserId: string;
  remoteUserId?: string;
  roomId: string;
  callId?: string;
  onCallStarted?: () => void;
  onCallEnded?: () => void;
}

export const useWebRTC = ({
  currentUserId,
  remoteUserId,
  roomId,
  callId,
  onCallStarted,
  onCallEnded,
}: UseWebRTCProps) => {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

    pc.onicecandidate = (event) => {
      if (event.candidate && remoteUserId) {
        socket.emit(SOCKET_WEBRTC_EVENTS.CANDIDATE, {
          to: remoteUserId,
          fromUserId: currentUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) remoteStreamRef.current = new MediaStream();
      event.streams[0].getTracks().forEach(track => remoteStreamRef.current?.addTrack(track));
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [remoteUserId, currentUserId]);

  const startCall = useCallback(async () => {
    if (!remoteUserId) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;

    const pc = createPeerConnection();
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    setIsCalling(true);
    onCallStarted?.();

    socket.emit(SOCKET_WEBRTC_EVENTS.OFFER, {
      to: remoteUserId,
      fromUserId: currentUserId,
      roomId,
      callType: "video",
      offer,
    });
  }, [remoteUserId, currentUserId, roomId, createPeerConnection, onCallStarted]);

  const acceptCall = useCallback(async (offer: RTCSessionDescriptionInit, fromUserId: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;

    const pc = createPeerConnection();
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // socket.emit(SOCKET_WEBRTC_EVENTS.ANSWER, { to: fromUserId, fromUserId: currentUserId, answer });
    socket.emit(SOCKET_WEBRTC_EVENTS.ANSWER, {
      to: remoteUserId,
      answer,
      roomId,
      callId, //  send callId back
    });
    setIsCalling(true);
    onCallStarted?.();
  }, [createPeerConnection, currentUserId, onCallStarted]);

  const endCall = useCallback(() => {
    peerConnectionRef.current?.close();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    setIsCalling(false);
    onCallEnded?.();

    if (remoteUserId) {
      // socket.emit(SOCKET_WEBRTC_EVENTS.END, { to: remoteUserId, fromUserId: currentUserId, roomId });
      socket.emit(SOCKET_WEBRTC_EVENTS.END, {
        to: remoteUserId,
        fromUserId: currentUserId,
        roomId,
        callId,
      });
    }
  }, [remoteUserId, currentUserId, roomId, onCallEnded]);

  useEffect(() => {
    socket.on(SOCKET_WEBRTC_EVENTS.CANDIDATE, ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on(SOCKET_WEBRTC_EVENTS.ANSWER, async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on(SOCKET_WEBRTC_EVENTS.END, () => endCall());

    return () => {
      socket.off(SOCKET_WEBRTC_EVENTS.CANDIDATE);
      socket.off(SOCKET_WEBRTC_EVENTS.ANSWER);
      socket.off(SOCKET_WEBRTC_EVENTS.END);
    };
  }, [endCall]);

  return { localStreamRef, remoteStreamRef, isCalling, startCall, acceptCall, endCall };
};
