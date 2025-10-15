// import { useRef, useState, useCallback, useEffect } from "react";
// import socket from "@/sockets/socket";
// import { SOCKET_WEBRTC_EVENTS } from "@/sockets/events";

// interface UseWebRTCProps {
//   currentUserId: string;
//   remoteUserId?: string;
//   roomId: string;
//   callId?: string;
//   onCallStarted?: () => void;
//   onCallEnded?: () => void;
// }

// export const useWebRTC = ({
//   currentUserId,
//   remoteUserId,
//   roomId,
//   callId,
//   onCallStarted,
//   onCallEnded,
// }: UseWebRTCProps) => {
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const remoteStreamRef = useRef<MediaStream | null>(null);
//   const [isCalling, setIsCalling] = useState(false);

//   const createPeerConnection = useCallback(() => {
//     const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

//     pc.onicecandidate = (event) => {
//       if (event.candidate && remoteUserId) {
//         socket.emit(SOCKET_WEBRTC_EVENTS.CANDIDATE, {
//           to: remoteUserId,
//           fromUserId: currentUserId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     pc.ontrack = (event) => {
//       if (!remoteStreamRef.current) remoteStreamRef.current = new MediaStream();
//       event.streams[0].getTracks().forEach(track => remoteStreamRef.current?.addTrack(track));
//     };

//     peerConnectionRef.current = pc;
//     return pc;
//   }, [remoteUserId, currentUserId]);

//   const startCall = useCallback(async () => {
//     if (!remoteUserId) return;

//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localStreamRef.current = stream;

//     const pc = createPeerConnection();
//     stream.getTracks().forEach(track => pc.addTrack(track, stream));

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     setIsCalling(true);
//     onCallStarted?.();

//     socket.emit(SOCKET_WEBRTC_EVENTS.OFFER, {
//       to: remoteUserId,
//       fromUserId: currentUserId,
//       roomId,
//       callType: "video",
//       offer,
//     });
//   }, [remoteUserId, currentUserId, roomId, createPeerConnection, onCallStarted]);

//   const acceptCall = useCallback(async (offer: RTCSessionDescriptionInit, fromUserId: string) => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localStreamRef.current = stream;

//     const pc = createPeerConnection();
//     stream.getTracks().forEach(track => pc.addTrack(track, stream));

//     await pc.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);

//     // socket.emit(SOCKET_WEBRTC_EVENTS.ANSWER, { to: fromUserId, fromUserId: currentUserId, answer });
//     socket.emit(SOCKET_WEBRTC_EVENTS.ANSWER, {
//       to: remoteUserId,
//       answer,
//       roomId,
//       callId, //  send callId back
//     });
//     setIsCalling(true);
//     onCallStarted?.();
//   }, [createPeerConnection, currentUserId, onCallStarted]);

//   const endCall = useCallback(() => {
//     peerConnectionRef.current?.close();
//     localStreamRef.current?.getTracks().forEach(track => track.stop());
//     localStreamRef.current = null;
//     remoteStreamRef.current = null;
//     setIsCalling(false);
//     onCallEnded?.();

//     if (remoteUserId) {
//       // socket.emit(SOCKET_WEBRTC_EVENTS.END, { to: remoteUserId, fromUserId: currentUserId, roomId });
//       socket.emit(SOCKET_WEBRTC_EVENTS.END, {
//         to: remoteUserId,
//         fromUserId: currentUserId,
//         roomId,
//         callId,
//       });
//     }
//   }, [remoteUserId, currentUserId, roomId, onCallEnded]);

//   useEffect(() => {
//     socket.on(SOCKET_WEBRTC_EVENTS.CANDIDATE, ({ candidate }) => {
//       if (peerConnectionRef.current && candidate) {
//         peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//       }
//     });

//     socket.on(SOCKET_WEBRTC_EVENTS.ANSWER, async ({ answer }) => {
//       if (peerConnectionRef.current) {
//         await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//       }
//     });

//     socket.on(SOCKET_WEBRTC_EVENTS.END, () => endCall());

//     return () => {
//       socket.off(SOCKET_WEBRTC_EVENTS.CANDIDATE);
//       socket.off(SOCKET_WEBRTC_EVENTS.ANSWER);
//       socket.off(SOCKET_WEBRTC_EVENTS.END);
//     };
//   }, [endCall]);

//   return { localStreamRef, remoteStreamRef, isCalling, startCall, acceptCall, endCall };
// };


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
  const [activeCallId, setActiveCallId] = useState<string | undefined>(callId);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

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
      event.streams[0].getTracks().forEach((track) =>
        remoteStreamRef.current?.addTrack(track)
      );
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [remoteUserId, currentUserId]);

  // 🔹 Start outgoing call
  const startCall = useCallback(async () => {
    if (!remoteUserId) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;

    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    setIsCalling(true);
    onCallStarted?.();

    // 🔹 Send OFFER (and listen for backend response with callId)
    socket.emit(
      SOCKET_WEBRTC_EVENTS.OFFER,
      {
        to: remoteUserId,
        fromUserId: currentUserId,
        roomId,
        callType: "video",
        offer,
      },
      (response: { callId?: string }) => {
        if (response?.callId) {
          setActiveCallId(response.callId);
          console.log("📞 Call ID from backend:", response.callId);
        }
      }
    );
  }, [remoteUserId, currentUserId, roomId, createPeerConnection, onCallStarted]);

  // 🔹 Accept incoming call
  const acceptCall = useCallback(
    async (offer: RTCSessionDescriptionInit, fromUserId: string, callId?: string) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit(SOCKET_WEBRTC_EVENTS.ANSWER, {
        to: fromUserId,
        fromUserId: currentUserId,
        answer,
        callId: callId || activeCallId,
      });

      if (callId) setActiveCallId(callId);
      setIsCalling(true);
      onCallStarted?.();
    },
    [createPeerConnection, currentUserId, activeCallId, onCallStarted]
  );

  // 🔹 End call
  const endCall = useCallback(() => {
    peerConnectionRef.current?.close();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    setIsCalling(false);
    onCallEnded?.();

    if (remoteUserId && activeCallId) {
      socket.emit(SOCKET_WEBRTC_EVENTS.END, {
        to: remoteUserId,
        fromUserId: currentUserId,
        roomId,
        callId: activeCallId,
      });
    }
  }, [remoteUserId, currentUserId, roomId, activeCallId, onCallEnded]);

  // 🔹 Socket handlers
  useEffect(() => {
    socket.on(SOCKET_WEBRTC_EVENTS.OFFER, async ({ from, offer, callId }) => {
      console.log("📥 Incoming OFFER:", callId);
      setActiveCallId(callId);
      await acceptCall(offer, from, callId);
    });

    socket.on(SOCKET_WEBRTC_EVENTS.ANSWER, async ({ answer, callId }) => {
      console.log("📥 Received ANSWER with callId:", callId);
      if (callId) setActiveCallId(callId);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.on(SOCKET_WEBRTC_EVENTS.CANDIDATE, ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on(SOCKET_WEBRTC_EVENTS.END, () => {
      console.log("📴 Call ended by remote");
      endCall();
    });

    return () => {
      socket.off(SOCKET_WEBRTC_EVENTS.OFFER);
      socket.off(SOCKET_WEBRTC_EVENTS.ANSWER);
      socket.off(SOCKET_WEBRTC_EVENTS.CANDIDATE);
      socket.off(SOCKET_WEBRTC_EVENTS.END);
    };
  }, [acceptCall, endCall]);

  return {
    localStreamRef,
    remoteStreamRef,
    isCalling,
    startCall,
    acceptCall,
    endCall,
    activeCallId,
  };
};
