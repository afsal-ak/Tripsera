import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { companyCreateChatRoom ,handleSearchUser} from '@/services/company/messageService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import type { IUser } from '@/types/IUser';
import type { IChatRoom } from '@/types/IMessage';

interface Props {
  onUserSelected?: () => void;
  onRoomCreated?: (room: IChatRoom) => void;
}

export default function CompanySearchForChat({
  onUserSelected,
  onRoomCreated,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const currentUser = useSelector((state: RootState) => state.userAuth.user);

  // 🔍 Fetch users (debounced)
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

    const delay = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // 👤 Handle click
  const handleUserClick = async (user: IUser) => {
    try {
      setCreatingRoom(true);

      const response = await companyCreateChatRoom({
        participants: [user._id!],
        isGroup: false,
      });

      const chatRoom: IChatRoom = response.data;

      onRoomCreated?.(chatRoom);
      onUserSelected?.();

      // reset
      setSearchQuery('');
      setUsers([]);
    } catch (error) {
      console.error('Chat creation failed:', error);
    } finally {
      setCreatingRoom(false);
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">

      {/* 🔍 Search Bar */}
      <div className="p-3 border-b">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
          <Search size={18} className="text-gray-500 mr-2" />

          <input
            type="text"
            placeholder="Search users..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* ❌ Clear Button */}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setUsers([]);
              }}
              className="text-gray-400 hover:text-gray-700 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-center text-gray-400 text-sm mt-3">
          Searching...
        </p>
      )}

      {/* 👥 User List */}
      <div className="flex-1 overflow-y-auto">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={user.profileImage?.url || '/profile-default.jpg'}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500">
                  {user.fullName || 'No name'}
                </p>
              </div>

              {user.role === 'admin' && (
                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
          ))
        ) : searchQuery && !loading ? (
          <p className="text-center text-gray-400 text-sm mt-4">
            No users found
          </p>
        ) : null}
      </div>

      {/* ⚡ Creating Chat */}
      {creatingRoom && (
        <p className="text-center text-blue-500 text-sm py-2">
          Creating chat...
        </p>
      )}
    </div>
  );
}
