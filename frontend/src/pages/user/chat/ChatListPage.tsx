import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserRooms } from '@/redux/slices/chatRoomSlice';
import { useChatRoomsSocket } from '@/hooks/useChatRoomsSocket ';
import type { RootState, AppDispatch } from '@/redux/store';
import { ChatList } from './ChatList';

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
      dispatch(fetchUserRooms({ isAdmin: false }));
    }
  }, [dispatch, currentUserId]);

  if (!currentUserId || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ChatList onRoomSelect={(room) => navigate(`/chat/${room._id}`)} selectedRoomId={roomId} />
  );
};

export default ChatListPage;
