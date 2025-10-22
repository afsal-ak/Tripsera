import React, { useState } from 'react';
import { ArrowLeft, Video, Phone, MoreVertical } from 'lucide-react';
import type { IChatRoom } from '@/types/IMessage';
import { VideoCallUI } from './VideoCallUI';

import { useCurrentUser } from '@/hooks/useCurrentUser ';

interface Props {
  room: IChatRoom;
  isPartnerOnline: boolean;
  onBack?: () => void;
  isMobile?: boolean;
}

export const ChatHeader: React.FC<Props> = ({ room, onBack, isMobile, isPartnerOnline }) => {
  // const currentUserId = useSelector((state: RootState) => state.userAuth.user?._id)
  const { id: currentUserId, profilePic, username } = useCurrentUser();

  console.log(currentUserId, 'current user id in heada');
  const otherUser = !room.isGroup ? room?.otherUser : null;
  const [showVideoCall, setShowVideoCall] = useState(false);

  const displayName = room.isGroup ? room.name : otherUser?.username;
  const displayAvatar = room.isGroup
    ? '/group-default.jpg'
    : otherUser?.profileImage || otherUser?.avatar || '/profile-default.jpg';
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          {/* Back button on mobile */}
          {isMobile && onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Avatar */}
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Name + Online Status */}
          <div>
            <h2 className="font-semibold text-gray-900">{displayName}</h2>
            {!room.isGroup && (
              <span className={`text-xs ${isPartnerOnline ? 'text-green-500' : 'text-gray-500'}`}>
                {isPartnerOnline ? 'Online' : 'Offline'}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVideoCall(true)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Video size={20} />
          </button>

          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      {/* Video Call UI Overlay */}
      {showVideoCall && (
        <VideoCallUI
          currentUserId={currentUserId!}
          remoteUserId={otherUser?._id!}
          roomId={room._id}
          onClose={() => setShowVideoCall(false)}
          remoteUserAvatar={otherUser?.profileImage}
          remoteUserName={otherUser?.username}
        />
      )}
    </>
  );
};
