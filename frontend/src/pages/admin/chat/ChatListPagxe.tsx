
 export interface ChatParticipantDTO {
  _id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  location?: string;
}

export interface ChatRoomResponseDTO {
  _id: string;
  name?: string;
  participants: ChatParticipantDTO[];
  createdBy: string;
  isGroup: boolean;
  lastMessageContent?: string;
  unreadCounts?: {
    [userId: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export interface MessageResponseDTO {
  _id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  attachments: string[];
  isRead: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock API functions (replace with your actual API)
export const getUserRoom = async (): Promise<ChatRoomResponseDTO[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      _id: "1",
      name: "Travel to Bali",
      participants: [
        {
          _id: "user1",
          name: "Emma Wilson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          isOnline: true,
          location: "Bali, Indonesia"
        },
        {
          _id: "user2",
          name: "You",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          isOnline: true
        }
      ],
      createdBy: "user1",
      isGroup: false,
      lastMessageContent: "The sunset at Uluwatu was incredible! 🌅",
      unreadCounts: { user2: 2 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "2",
      participants: [
        {
          _id: "user3",
          name: "Carlos Rodriguez",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          isOnline: false,
          location: "Rome, Italy"
        }
      ],
      createdBy: "user3",
      isGroup: false,
      lastMessageContent: "Thanks for the restaurant recommendation! 🍝",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};

export const getMessagesByRoom = async (roomId: string): Promise<MessageResponseDTO[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      _id: "msg1",
      roomId,
      senderId: "user1",
      content: "Hey! How's your trip planning going?",
      type: MessageType.TEXT,
      attachments: [],
      isRead: true,
      readBy: ["user2"],
      createdAt: new Date(Date.now() - 120000),
      updatedAt: new Date(Date.now() - 120000)
    },
    {
      _id: "msg2",
      roomId,
      senderId: "user2",
      content: "Great! I'm so excited about Bali. Any must-see places?",
      type: MessageType.TEXT,
      attachments: [],
      isRead: true,
      readBy: ["user1"],
      createdAt: new Date(Date.now() - 60000),
      updatedAt: new Date(Date.now() - 60000)
    },
    {
      _id: "msg3",
      roomId,
      senderId: "user1",
      content: "The sunset at Uluwatu was incredible! 🌅",
      type: MessageType.TEXT,
      attachments: [],
      isRead: false,
      readBy: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};


// // Main App Component - Demo Usage
// const TravelChatApp: React.FC = () => {
//   const [selectedRoom, setSelectedRoom] = useState<ChatRoomResponseDTO | null>(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
//   const [showChat, setShowChat] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleRoomSelect = (room: ChatRoomResponseDTO) => {
//     setSelectedRoom(room);
//     if (isMobile) {
//       setShowChat(true);
//     }
//   };

//   const handleBackToList = () => {
//     if (isMobile) {
//       setShowChat(false);
//       setSelectedRoom(null);
//     }
//   };

//   const handleToggleSidebar = () => {
//     setSidebarCollapsed(!sidebarCollapsed);
//   };

//   if (isMobile) {
//     // Mobile Layout: Either show chat list OR message page
//     return (
//       <div className="flex h-screen bg-white">
//         {!showChat ? (
//           <ChatList
//             className="w-full"
//             onRoomSelect={handleRoomSelect}
//             selectedRoomId={selectedRoom?._id}
//             isCollapsed={false}
//           />
//         ) : selectedRoom ? (
//           <MessagePage
//             room={selectedRoom}
//             onBack={handleBackToList}
//             showBackButton={true}
//             className="w-full"
//           />
//         ) : null}
//       </div>
//     );
//   }

//   // Desktop Layout: Always show sidebar on left + message section on right
//   return (
//     <div className="flex h-screen bg-white">
//       {/* Left Sidebar - Always visible on desktop */}
//       <ChatList
//         className={sidebarCollapsed ? "w-16" : "w-80"}
//         onRoomSelect={handleRoomSelect}
//         selectedRoomId={selectedRoom?._id}
//         isCollapsed={sidebarCollapsed}
//         onToggleSidebar={handleToggleSidebar}
//       />

//       {/* Right Section - Message Area */}
//       <div className="flex-1 flex flex-col">
//         {selectedRoom ? (
//           <MessagePage
//             room={selectedRoom}
//             showBackButton={false}
//             className="flex-1"
//           />
//         ) : (
//           // Empty State when no chat selected
//           <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
//             {sidebarCollapsed && (
//               <div className="p-4 bg-blue-600 border-b border-blue-500">
//                 <button 
//                   onClick={handleToggleSidebar}
//                   className="p-2 hover:bg-blue-700 rounded-full transition-colors text-white"
//                 >
//                   <Menu className="w-5 h-5" />
//                 </button>
//               </div>
//             )}
            
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center max-w-md mx-auto px-4">
//                 <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <MessageCircle className="w-12 h-12 text-blue-500" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-3">Connect with Travel Buddies</h2>
//                 <p className="text-gray-600 leading-relaxed">
//                   Start conversations with fellow travelers, share experiences, and plan your next adventure together. Select a chat to begin your journey!
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TravelChatApp;