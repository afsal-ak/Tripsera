import type { UserBasicInfo } from "@/types/UserBasicInfo";
import { useNavigate } from "react-router-dom";

interface UserListProps {
  title: string;
  users: UserBasicInfo[];
  isOpen: boolean;
  onClose: () => void;
}

const UserList: React.FC<UserListProps> = ({ title, users, isOpen, onClose }) => {

    const navigate=useNavigate()

    

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-96 max-h-[500px] rounded-2xl shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* User list */}
        <div className="divide-y">
            
          {users.map((user) => (
            <div
              key={user._id}
              onClick={()=>navigate(`/profile/${user.username}`)}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
            >
              <img
                src={user.profileImage || "/profile-default.jpg"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UserList