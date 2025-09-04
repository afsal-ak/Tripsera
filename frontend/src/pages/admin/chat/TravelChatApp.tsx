
import { useState,useEffect } from "react";
import { ChatList } from "./ChatList";
import MessagePage from "./MessagePage";
import type{ IChatRoom } from "@/types/Message";
import { 
  
  MessageCircle,
  
  Menu,
   
} from "lucide-react";


// Main App Component - Demo Usage
const TravelChatApp = () => {
  const [selectedRoom, setSelectedRoom] = useState<IChatRoom | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showChat, setShowChat] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRoomSelect = (room: IChatRoom) => {
    setSelectedRoom(room);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowChat(false);
      setSelectedRoom(null);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isMobile) {
    // Mobile Layout: Either show chat list OR message page
    return (
      <div className="flex h-screen bg-white">
        {!showChat ? (
          <ChatList
            className="w-full"
            onRoomSelect={handleRoomSelect}
            selectedRoomId={selectedRoom?._id}
            isCollapsed={false}
          />
        ) : selectedRoom ? (
          <MessagePage
            room={selectedRoom}
        //    onBack={handleBackToList}
            //showBackButton={true}
           /// className="w-full"
          />
        ) : null}
      </div>
    );
  }

  // Desktop Layout: Always show sidebar on left + message section on right
  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Always visible on desktop */}
      <ChatList
        className={sidebarCollapsed ? "w-16" : "w-80"}
        onRoomSelect={handleRoomSelect}

        selectedRoomId={selectedRoom?._id}
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Right Section - Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <MessagePage
            room={selectedRoom}
         //   showBackButton={false}
           // className="flex-1"
          />
        ) : (
          // Empty State when no chat selected
          <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            {sidebarCollapsed && (
              <div className="p-4 bg-blue-600 border-b border-blue-500">
                <button 
                  onClick={handleToggleSidebar}
                  className="p-2 hover:bg-blue-700 rounded-full transition-colors text-white"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto px-4">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Connect with Travel Buddies</h2>
                <p className="text-gray-600 leading-relaxed">
                  Start conversations with fellow travelers, share experiences, and plan your next adventure together. Select a chat to begin your journey!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelChatApp;