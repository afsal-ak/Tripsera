import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { ChatRoomItem } from '@/components/chat/ChatRoomItem';
import { ChatListHeader } from '@/components/chat/ChatListHeader';
import UserSearchForChat from '@/components/chat/UserSearchForChat';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import type { IChatRoom } from '@/types/IMessage';
import { useTotalUnreadCount } from '@/hooks/useTotalUnreadCount';
import { EnumUserRole } from '@/Constants/enums/userEnum';
interface ChatListProps {
  onRoomSelect: (room: IChatRoom) => void;
  selectedRoomId?: string;
}

export const ChatList = ({ onRoomSelect, selectedRoomId }: ChatListProps) => {
  const rooms = useSelector((state: RootState) => state.chatRoom.rooms);
  const currentUserId = useSelector((state: RootState) => state.userAuth.user?._id);
  const [search, setSearch] = useState('');

  const totalUnread = useTotalUnreadCount(EnumUserRole.USER);
  console.log(totalUnread, 'coutn unread');

  const filteredRooms = rooms.filter((room) => {
    const otherParticipant = room.otherUser;
    console.log(otherParticipant, 'other');
    //  room.participants.find((p) => p._id !== currentUserId) || room.participants[0];
    const searchTerm = search.toLowerCase();
    return (
      otherParticipant?.username?.toLowerCase().includes(searchTerm) ||
      (room.isGroup && room.name?.toLowerCase().includes(searchTerm)) ||
      (room.lastMessageContent || '').toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="bg-white flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <ChatListHeader role="user" totalUnread={totalUnread} />
        <UserSearchForChat onRoomCreated={() => {}} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 px-4">
            <MessageCircle className="w-8 h-8 mb-2 text-gray-300" />
            <p className="text-sm text-center">No conversations found</p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              onClick={() => onRoomSelect(room)}
              className={`cursor-pointer ${
                selectedRoomId === room._id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <ChatRoomItem
                room={room}
                currentUserId={currentUserId!}
                onSelect={onRoomSelect}
                isSelected={selectedRoomId === room._id}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
