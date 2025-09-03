// Chat List Header Component
import { X,Plus,Settings } from "lucide-react";
export const ChatListHeader: React.FC<{ onToggleSidebar?: () => void; showToggle?: boolean }> = ({ 
  onToggleSidebar, 
  showToggle = false 
}) => (
  <div className="flex items-center justify-between p-4 bg-blue-600 text-white border-b border-blue-500">
    <div className="flex items-center space-x-3">
      <h1 className="text-xl font-semibold">Travel Chats</h1>
    </div>
    <div className="flex items-center space-x-2">
      {showToggle && onToggleSidebar && (
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
        <Plus className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  </div>
);