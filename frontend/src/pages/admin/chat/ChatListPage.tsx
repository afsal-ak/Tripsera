import { useNavigate, useParams } from "react-router-dom";
import { ChatList } from "./ChatList";

export const ChatListPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  return (
    <ChatList
      onRoomSelect={(room) => navigate(`/admin/chat/${room._id}`)}
      selectedRoomId={roomId}
    />
  );
};
