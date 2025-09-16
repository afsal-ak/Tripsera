
// import { useState, useEffect } from "react";
// import { MessageCircle } from "lucide-react";
// import { useSelector } from "react-redux";
// import { toast } from "sonner";
// import { getUserRoom } from "@/services/user/messageService";
// import type { RootState } from "@/redux/store";
// import type { IChatRoom } from "@/types/IMessage";
// import { ChatRoomItem } from "@/components/chat/ChatRoomItem";
// import { ChatListHeader } from "@/components/chat/ChatListHeader";
// import UserSearchForChat from "@/components/chat/UserSearchForChat";

// interface ChatListProps {
//   onRoomSelect: (room: IChatRoom) => void;
//   selectedRoomId?: string;
// }

// export const ChatList: React.FC<ChatListProps> = ({
//   onRoomSelect,
//   selectedRoomId,
// }) => {
//   const [rooms, setRooms] = useState<IChatRoom[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   const currentUserId = useSelector(
//     (state: RootState) => state.userAuth.user?._id
//   );

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await getUserRoom();
//       setRooms(response.data || []);
//     } catch (error: any) {
//       console.error("Error fetching rooms:", error);
//       toast.error(error?.response?.data?.message || "Failed to fetch rooms");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter rooms based on search term
//   const filteredRooms = Array.isArray(rooms)
//     ? rooms.filter((room) => {
//         const otherParticipant =
//           room.participants.find((p) => p._id !== currentUserId) ||
//           room.participants[0];

//         const searchTerm = search.toLowerCase();
//         return (
//           otherParticipant?.username?.toLowerCase().includes(searchTerm) ||
//           (room.isGroup && room.name?.toLowerCase().includes(searchTerm)) ||
//           room.lastMessageContent?.toLowerCase().includes(searchTerm)
//         );
//       })
//     : [];

//   return (
//     <div className="bg-white flex flex-col h-full">
//       {/* Sticky Chat List Header */}
//       <div className="sticky top-0 z-10 bg-white shadow-sm">
//         <ChatListHeader />
//         <UserSearchForChat
//           onRoomCreated={(newRoom) => {
//             setRooms((prevRooms) => {
//               const exists = prevRooms.some((room) => room._id === newRoom._id);
//               return exists ? prevRooms : [newRoom, ...prevRooms];
//             });
//           }}
//         />
//       </div>

//       {/* Chat Rooms */}
//       <div className="flex-1 overflow-y-auto">
//         {loading ? (
//           <div className="flex items-center justify-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           </div>
//         ) : filteredRooms.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-32 text-gray-500 px-4">
//             <MessageCircle className="w-8 h-8 mb-2 text-gray-300" />
//             <p className="text-sm text-center">No conversations found</p>
//           </div>
//         ) : (
//           filteredRooms.map((room) => (
//             <ChatRoomItem
//               key={room._id}
//               room={room}
//               currentUserId={currentUserId!}
//               onSelect={onRoomSelect}
//               isSelected={selectedRoomId === room._id}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };


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
  const currentUserId = useSelector((state: RootState) => state.userAuth.user?._id);
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
