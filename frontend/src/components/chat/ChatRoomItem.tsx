 import type { IChatRoom } from "@/types/Message";

import { MapPin } from "lucide-react";
// Chat Room Item Component
export const ChatRoomItem: React.FC<{ 
  room: IChatRoom; 
  currentUserId: string;
  onSelect: (room: IChatRoom) => void;
  isSelected?: boolean;
}> = ({ room, currentUserId, onSelect, isSelected = false }) => {
  // Get the other participant (not the current user)
  const otherParticipant = room.participants.find(p => p._id !== currentUserId) || room.participants[0];
  const unreadCount = room.unreadCounts?.[currentUserId] || 0;
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffHours = Math.abs(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
    } else if (diffHours < 168) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div
      onClick={() => onSelect(room)}
      className={`flex items-center p-4 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-colors ${
        isSelected ? 'bg-blue-100 border-blue-200' : ''
      }`}
    >
      <div className="relative mr-3">
        <img
          src={otherParticipant.avatar || '/default-avatar.png'}
          alt={otherParticipant.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        {otherParticipant.isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900 truncate">
            {room.isGroup ? room.name : otherParticipant.username}
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            {formatTime(room.updatedAt)}
          </span>
        </div>
        
        {otherParticipant.location && !room.isGroup && (
          <div className="flex items-center mb-1">
            <MapPin className="w-3 h-3 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500 truncate">{otherParticipant.location}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate pr-2">
            {room.lastMessageContent || "No messages yet"}
          </p>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};