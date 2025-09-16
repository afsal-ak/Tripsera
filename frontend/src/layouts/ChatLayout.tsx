import { Outlet, useParams, useNavigate } from "react-router-dom";
import  ChatListPage  from "@/pages/user/chat/ChatListPage";
import { ArrowLeft } from "lucide-react";

const ChatLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar (Chat List) */}
      <div
        className={`
          border-r border-gray-200 flex flex-col h-full
          lg:w-80 lg:block
          ${roomId ? "hidden" : "w-full"}
          lg:flex-shrink-0
        `}
      >
        <ChatListPage />
      </div>

      {/* Right Content Area */}
      <div
        className={`
          flex-1 flex flex-col h-full
          ${!roomId ? "hidden lg:flex" : "flex"}
        `}
      >
        {roomId ? (
          <>
            {/* Mobile Back Header */}
            <div className="lg:hidden p-3 border-b flex items-center gap-3 bg-white sticky top-0 z-10 shadow-sm">
              <button
                onClick={() => navigate("/chat")}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-medium text-gray-700">Chat</h1>
            </div>

            {/* Message Section */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <Outlet />
            </div>
          </>
        ) : (
          // Empty state for large screens
          <div className="hidden lg:flex items-center justify-center flex-1 text-gray-400 text-lg">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
