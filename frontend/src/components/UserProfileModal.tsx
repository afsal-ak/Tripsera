import React from "react";
import { X } from "lucide-react";
import type { UserBasicInfo } from "@/types/UserBasicInfo";

interface UserProfileModalProps {
  user: UserBasicInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-80 md:w-96 relative p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Profile Info */}
        <div className="flex flex-col items-center mt-4">
          <img
            src={user.profileImage || "/default-profile.jpg"}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <h2 className="mt-3 font-semibold text-lg">{user.username}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
