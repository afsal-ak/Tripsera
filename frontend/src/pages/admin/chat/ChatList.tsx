import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ChatRoomItem } from "@/components/chat/ChatRoomItem";
import { ChatListHeader } from "@/components/chat/ChatListHeader";
import UserSearchForChat from "@/components/chat/UserSearchForChat";
import { MessageCircle } from "lucide-react";
import { useState, useMemo } from "react";
import type { IChatRoom } from "@/types/IMessage";
import { Button } from "@/components/ui/button";
import { useTotalUnreadCount } from "@/hooks/useTotalUnreadCount";
interface ChatListProps {
  onRoomSelect: (room: IChatRoom) => void;
  selectedRoomId?: string;
}

export const ChatList = ({ onRoomSelect, selectedRoomId }: ChatListProps) => {
  const rooms = useSelector((state: RootState) => state.chatRoom.rooms);
  const currentUserId = useSelector(
    (state: RootState) => state.adminAuth.admin?._id
  );

  const [search, setSearch] = useState("");
  const [sortByUnread, setSortByUnread] = useState(false);

  let totalUnread= useTotalUnreadCount(currentUserId!)
   console.log(totalUnread,'coutn unread')

   const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const otherParticipant =room.otherUser
      const searchTerm = search.toLowerCase();

      return (
        otherParticipant?.username?.toLowerCase().includes(searchTerm) ||
        (room.isGroup && room.name?.toLowerCase().includes(searchTerm)) ||
        (room.lastMessageContent || "").toLowerCase().includes(searchTerm)
      );
    });
  }, [rooms, currentUserId, search]);

   const sortedRooms = useMemo(() => {
    if (sortByUnread) {
      return [...filteredRooms].sort(
        (a, b) =>
          (b.unreadCounts?.[currentUserId!] || 0) -
          (a.unreadCounts?.[currentUserId!] || 0)
      );
    } else {
      return [...filteredRooms].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
  }, [filteredRooms, sortByUnread, currentUserId]);

  return (
   <div className="bg-white flex flex-col h-full">
  {/* Header */}
  <div className="sticky top-0 z-10 bg-white shadow-sm">
    <div className="p-2">
      <ChatListHeader role='admin' totalUnread={totalUnread} />
    </div>

    {/* Sort Button */}
    <div className="px-2 pb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSortByUnread((prev) => !prev)}
        className="w-full"
      >
        {sortByUnread ? "Sort by Recent" : "Sort by Unread"}
        {sortByUnread && totalUnread > 0 && (
          <span className="ml-2 text-red-500 font-bold">
            ({totalUnread})
          </span>
        )}
      </Button>
    </div>

    {/* Search */}
    <UserSearchForChat onRoomCreated={() => {}} />
  </div>

  {/* Room List */}
  <div className="flex-1 overflow-y-auto">
    {sortedRooms.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500 px-4">
        <MessageCircle className="w-8 h-8 mb-2 text-gray-300" />
        <p className="text-sm text-center">No conversations found</p>
      </div>
    ) : (
      sortedRooms.map((room) => (
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
)}