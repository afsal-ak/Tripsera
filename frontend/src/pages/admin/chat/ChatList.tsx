
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { IChatRoom } from "@/types/Message";
import { handleSearchUserForChat } from "@/services/user/profileService";
import { getUserRoom } from "@/services/admin/messageService";
import { MessageCircle, Menu } from "lucide-react";
 import { SearchBar } from "@/components/chat/SearchBar";

import { ChatRoomItem } from "@/components/chat/ChatRoomItem";
import { ChatListHeader } from "@/components/chat/ChatListHeader";
import { toast } from "sonner";
import type {  RootState } from "@/redux/store";
import { useSelector } from "react-redux";


export const ChatList: React.FC<{
  className?: string;
  onRoomSelect: (room: IChatRoom) => void;
   selectedRoomId?: string;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}> = ({
  className = "",
  onRoomSelect,
   selectedRoomId,
  isCollapsed = false,
  onToggleSidebar,
}) => {
  const [rooms, setRooms] = useState<IChatRoom[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
 
   
  let currentUserId=useSelector((state:RootState)=>state.adminAuth.admin?._id)
  console.log(currentUserId,'admin')
   

  useEffect(() => {
    fetchRooms();
  }, []);
//console.log(rooms,'rooooom')
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getUserRoom();
      console.log(response)
      setRooms(response.data || []);
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on search term
  const filteredRooms = Array.isArray(rooms)
    ? rooms.filter((room) => {
        const otherParticipant =
          room.participants.find((p) => p._id !== currentUserId) ||
          room.participants[0];
 
        const searchTerm = search.toLowerCase();
        return (
          otherParticipant?.username?.toLowerCase().includes(searchTerm) ||
          (room.isGroup &&
            room.name?.toLowerCase().includes(searchTerm)) ||
          room.lastMessageContent?.toLowerCase().includes(searchTerm)
          
        );
      })
    : [];
   // Collapsed sidebar view
  if (isCollapsed) {
    return (
      <div
        className={`w-16 bg-white border-r border-gray-200 flex flex-col h-full ${className}`}
      >
        <div className="flex items-center justify-center p-4 bg-blue-600">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {filteredRooms.slice(0, 8).map((room) => {
            const otherParticipant =
              room.participants.find((p) => p._id !== currentUserId) ||
              room.participants[0];

            const unreadCount = room.unreadCounts?.[currentUserId!] || 0;

            return (
              <div
                key={room._id}
                onClick={() => onRoomSelect(room)}
                className={`flex items-center justify-center p-2 mx-2 my-1 cursor-pointer rounded-lg hover:bg-blue-50 transition-colors relative ${
                  selectedRoomId === room._id ? "bg-blue-100" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={
                      otherParticipant.profileImage?.url ||
                      "/profile-default.jpg"
                    }
                    alt={otherParticipant?.username || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Expanded sidebar view
  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col h-full ${className}`}
    >
      <ChatListHeader
        onToggleSidebar={onToggleSidebar}
        showToggle={!!onToggleSidebar}
      />
      <SearchBar search={search} setSearch={setSearch} />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
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
