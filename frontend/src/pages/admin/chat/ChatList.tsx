

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ChatRoomItem } from "@/components/chat/ChatRoomItem";
import { ChatListHeader } from "@/components/chat/ChatListHeader";
import UserSearchForChat from "@/components/chat/UserSearchForChat";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import type { IChatRoom } from "@/types/IMessage";

interface ChatListProps {
  onRoomSelect: (room: IChatRoom) => void;
  selectedRoomId?: string;
}

export const ChatList = ({ onRoomSelect, selectedRoomId }: ChatListProps) => {
  const rooms = useSelector((state: RootState) => state.chatRoom.rooms);
  const currentUserId = useSelector((state: RootState) => state.adminAuth.admin?._id);
  const [search, setSearch] = useState("");

  const filteredRooms = rooms.filter((room) => {
    const otherParticipant = room.participants.find((p) => p._id !== currentUserId) || room.participants[0];
    const searchTerm = search.toLowerCase();
    return (
      otherParticipant?.username?.toLowerCase().includes(searchTerm) ||
      (room.isGroup && room.name?.toLowerCase().includes(searchTerm)) ||
      (room.lastMessageContent || "").toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="bg-white flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <ChatListHeader />
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
            <ChatRoomItem
              key={room._id}
              room={room}
              currentUserId={currentUserId!}
              onSelect={onRoomSelect}
              isSelected={selectedRoomId === room._id}
            />
          ))
        )}
      </div>
    </div>
  );
};
