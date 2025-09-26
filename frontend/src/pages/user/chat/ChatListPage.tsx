
// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useChatRoomsSocket } from "@/hooks/useChatRoomsSocket ";
// import { setRooms } from "@/redux/slices/chatRoomSlice";
// import { getUserRoom } from "@/services/user/messageService";
// import type { RootState, AppDispatch } from "@/redux/store";
// import { ChatList } from "./ChatList";

// const ChatListPage = () => {
//   const navigate = useNavigate();
//   const { roomId } = useParams();

//   const dispatch = useDispatch<AppDispatch>();
//   const currentUserId = useSelector((state: RootState) => state.userAuth.user?._id);

//   if (!currentUserId) return null;

//   useChatRoomsSocket({ currentUserId });

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const res = await getUserRoom();
//         dispatch(setRooms(res.data));
//       } catch (error) {
//         console.error("Error fetching rooms", error);
//       }
//     };

//     fetchRooms();
//   }, [dispatch]);

//   return (
//     <ChatList
//       onRoomSelect={(room) => navigate(`/chat/${room._id}`)}
//       selectedRoomId={roomId}
//     />
//   );
// };

// export default ChatListPage;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserRooms } from "@/redux/slices/chatRoomSlice";
import { useChatRoomsSocket } from "@/hooks/useChatRoomsSocket ";
import type { RootState, AppDispatch } from "@/redux/store";
import { ChatList } from "./ChatList";

const ChatListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  const currentUserId = useSelector((state: RootState) => state.userAuth.user?._id);
  const { loading, error } = useSelector((state: RootState) => state.chatRoom);

  // 🔌 Hook up socket events
  if (currentUserId) {
    useChatRoomsSocket({ currentUserId });
  }

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchUserRooms({isAdmin:false}));
    }
  }, [dispatch, currentUserId]);

  if (!currentUserId || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ChatList
      onRoomSelect={(room) => navigate(`/chat/${room._id}`)}
      selectedRoomId={roomId}
    />
  );
};

export default ChatListPage;
