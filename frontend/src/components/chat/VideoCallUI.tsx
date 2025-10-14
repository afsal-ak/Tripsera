import { useEffect, useRef, useState } from "react";
import { PhoneOff, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebRTC } from "@/hooks/useWebRTC";

interface VideoCallProps {
  currentUserId: string;
  remoteUserId?: string;
  roomId: string;
  onClose?: () => void;
  incomingCall?: {
    fromUserId: string;
    roomId: string;
    offer: RTCSessionDescriptionInit;
    fromUserName?: string;
    fromUserAvatar?: string;
    callId?: string;
  };
  remoteUserName?: string;
  remoteUserAvatar?: string;
}

export const VideoCallUI = ({
  currentUserId,
  remoteUserId,
  roomId,
  onClose,
  incomingCall: initialIncomingCall,
  remoteUserName,
  remoteUserAvatar,
}: VideoCallProps) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [incomingCall, setIncomingCall] = useState(initialIncomingCall || null);
  const [outgoingCall, setOutgoingCall] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const {
    localStreamRef,
    remoteStreamRef,
    isCalling,
    startCall,
    acceptCall,
    endCall,
  } = useWebRTC({
    currentUserId,
    remoteUserId: remoteUserId || incomingCall?.fromUserId,
    roomId,
    callId: incomingCall?.callId,
    onCallEnded: () => {
      setOutgoingCall(false);
      setIncomingCall(null);
      onClose?.();
    },
  });

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [localStreamRef.current]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [remoteStreamRef.current]);

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    setMicEnabled(prev => !prev);
  };

  const toggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
    setCamEnabled(prev => !prev);
  };

  const handleAccept = () => {
    if (!incomingCall) return;
    acceptCall(incomingCall.offer, incomingCall.fromUserId);
    setIncomingCall(null);
  };

  const handleReject = () => {
    endCall();
    setIncomingCall(null);
    setOutgoingCall(false);
  };

  const handleStartCall = () => {
    startCall();
    setOutgoingCall(true);
  };
  const handleCancelCall = () => {
    endCall()
    setOutgoingCall(false);

  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white z-50">
      {/* Remote Video */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* Local Video */}
        <div className="absolute bottom-6 right-6 w-40 h-32 bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Incoming Call UI */}
      {incomingCall && !isCalling && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 p-6">
          {incomingCall.fromUserAvatar ? (
            <img
              src={incomingCall.fromUserAvatar}
              alt={incomingCall.fromUserName || "Caller"}
              className="w-24 h-24 rounded-full object-cover border-2 border-white mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold mb-4">
              {incomingCall.fromUserName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <p className="text-lg font-semibold mb-2">{incomingCall.fromUserName || "Unknown"}</p>
          <p className="text-gray-300 mb-4">is calling...</p>
          <div className="flex gap-4">
            <Button onClick={handleAccept} className="px-6 py-2 text-lg bg-green-500 hover:bg-green-600 rounded-full">
              Accept
            </Button>
            <Button onClick={handleReject} variant="destructive" className="px-6 py-2 text-lg rounded-full">
              Reject
            </Button>
          </div>
        </div>
      )}

      {/* Outgoing Call UI */}
      {!isCalling && !incomingCall && !outgoingCall && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 p-6">
          {/* Avatar */}
          {remoteUserAvatar ? (
            <img
              src={remoteUserAvatar}
              alt={remoteUserName || "User"}
              className="w-24 h-24 rounded-full object-cover border-2 border-white mb-4 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
              {remoteUserName?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          {/* Name & Label */}
          <p className="text-xl font-semibold mb-1">{remoteUserName || "Start Call"}</p>
          <p className="text-gray-300 mb-6">Do you want to start a video call?</p>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleStartCall}
              className="px-6 py-2 text-lg bg-blue-500 hover:bg-blue-600 rounded-full shadow-md"
            >
              Start Call
            </Button>
            <Button
              onClick={handleCancelCall}
              variant="destructive"
              className="px-6 py-2 text-lg rounded-full shadow-md bg-red-600 hover:bg-red-700"
            >
              Cancel Call
            </Button>
          </div>
        </div>
      )}


      {/* Call Controls */}
      {isCalling && (
        <div className="absolute bottom-8 flex items-center justify-center gap-6">
          <Button onClick={toggleMic} variant="outline" className="rounded-full w-14 h-14 bg-gray-800 hover:bg-gray-700 border-none">
            {micEnabled ? <Mic size={22} /> : <MicOff size={22} className="text-red-500" />}
          </Button>
          <Button onClick={toggleCam} variant="outline" className="rounded-full w-14 h-14 bg-gray-800 hover:bg-gray-700 border-none">
            {camEnabled ? <Camera size={22} /> : <CameraOff size={22} className="text-red-500" />}
          </Button>
          <Button onClick={endCall} variant="destructive" className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700">
            <PhoneOff size={28} />
          </Button>
        </div>
      )}
    </div>
  );
};
