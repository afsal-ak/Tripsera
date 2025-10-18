import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { handleSearchUser } from '@/services/admin/userService';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import type { IUser } from '@/types/IUser';
import type { IChatRoom } from '@/types/IMessage';
import { createChatRoom } from '@/services/user/messageService';
interface Props {
  onUserSelected?: () => void;
  onRoomCreated?: (room: IChatRoom) => void;
}

export default function UserSearch({ onUserSelected, onRoomCreated }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const currentUser = useSelector((state: RootState) => state.userAuth.user);
  const navigate = useNavigate();

  // Fetch users when searchQuery changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!searchQuery.trim()) {
          setUsers([]);
          return;
        }
        setLoading(true);
        const response = await handleSearchUser(searchQuery);
        setUsers(response.data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleUserClick = async (user: IUser) => {
    try {
      setCreatingRoom(true);

      const payload = {
        participants: [user._id!],
        isGroup: false,
      };

      const response = await createChatRoom(payload);
      const chatRoom: IChatRoom = response.data;

      //  Trigger callback to update chat list instantly
      if (onRoomCreated) onRoomCreated(chatRoom);

      navigate(`/admin/chat`);

      //  Close modal if callback provided
      if (onUserSelected) onUserSelected();
    } catch (error) {
      console.error('Failed to create/get chat room:', error);
    } finally {
      setCreatingRoom(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      {/* Search Input */}
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-4">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search users to chat..."
          className="flex-1 bg-transparent focus:outline-none text-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <p className="text-center text-gray-500 mb-3">Searching...</p>}

      {/* User List */}
      <div className="max-h-72 overflow-y-auto">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={user.profileImage?.url || '/profile-default.jpg'}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover mr-3 border"
              />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{user.username}</p>
                {/* <p className="text-gray-500 text-sm">
                                    {user.fullName || "No full name"}
                                </p> */}
              </div>
              {user.role === 'admin' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Admin
                </span>
              )}
            </div>
          ))
        ) : searchQuery.trim() !== '' && !loading ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          <p className="text-center text-gray-400">Start typing to search users</p>
        )}
      </div>

      {/* Creating Chat Loader */}
      {creatingRoom && <p className="text-center text-blue-500 mt-3">Creating chat...</p>}
    </div>
  );
}
