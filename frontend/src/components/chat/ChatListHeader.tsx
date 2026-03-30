import { useState } from 'react';
import { X, Plus, ArrowLeft, ArrowBigLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatFilter from './ChatFilter';
import UserSearchForChat from './UserSearchForChat';
import type { IChatRoom } from '@/types/IMessage';
import AdminSearchForChat from './AdminSearchForChat';

interface ChatListHeaderProps {
  role: 'user' | 'admin';
  totalUnread: number;
  onToggleSidebar?: () => void;
  showToggle?: boolean;
  onRoomCreated?: (room: IChatRoom) => void;
}

export const ChatListHeader = ({
  role,
  totalUnread,
  onToggleSidebar,
  showToggle = false,
  onRoomCreated,
}: ChatListHeaderProps) => {
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white border-b border-blue-500">
        <h1 className="text-xl font-semibold">Travel Chats</h1>

        <div className="flex items-center space-x-2">
          {showToggle && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-blue-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* ➕ Open Search */}
          <button
            onClick={() => setIsUserSearchOpen(true)}
            className="p-2 hover:bg-blue-700 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </button>

          <ChatFilter role={role} totalUnread={totalUnread} />
        </div>
      </div>

      {/* 🔥 Slide Panel */}
      <AnimatePresence>
        {isUserSearchOpen && (
          <motion.div
            className="absolute inset-0 z-50 bg-white"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            {/* Top Bar */}
            {/* <div className="flex items-center p-4 bg-blue-600 text-white">
              <button
                onClick={() => setIsUserSearchOpen(false)}
                className="mr-3"
              >
                <ArrowBigLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">New Chat</h2>
            </div> */}
            <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
              {/* Title */}
              <h2 className="text-lg font-semibold">New Chat</h2>

              {/* ❌ Close Button (Right Side) */}
              <button
                onClick={() => setIsUserSearchOpen(false)}
                className="p-1 rounded-full hover:bg-blue-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Search */}
            {/* <div className="p-3">
              <UserSearchForChat
                onUserSelected={() => setIsUserSearchOpen(false)}
                onRoomCreated={(room) => {
                  onRoomCreated?.(room);
                  setIsUserSearchOpen(false);
                }}
              />
            </div> */}
            <div className="p-3">
  {role === 'user' ? (
    <UserSearchForChat
      onUserSelected={() => setIsUserSearchOpen(false)}
      onRoomCreated={(room) => {
        onRoomCreated?.(room);
        setIsUserSearchOpen(false);
      }}
    />
  ) : (
    <AdminSearchForChat
      onUserSelected={() => setIsUserSearchOpen(false)}
      onRoomCreated={(room) => {
        onRoomCreated?.(room);
        setIsUserSearchOpen(false);
      }}
    />
  )}
</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// import { useState } from 'react';
// import { X, Plus } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import ChatFilter from './ChatFilter';

// interface ChatListHeaderProps {
//   role: 'user' | 'admin';
//   totalUnread: number;
//   onToggleSidebar?: () => void;
//   showToggle?: boolean;
// }
// export const ChatListHeader = ({
//   role,
//   totalUnread,
//   onToggleSidebar,
//   showToggle = false,
// }: ChatListHeaderProps) => {
//   const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
//   const [filterOpen, setFilterOpen] = useState(false);

//   return (
//     <>
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-blue-600 text-white border-b border-blue-500">
//         <div className="flex items-center space-x-3">
//           <h1 className="text-xl font-semibold">Travel Chats</h1>
//         </div>
//         <div className="flex items-center space-x-2">
//           {/* Sidebar Toggle Button */}
//           {showToggle && onToggleSidebar && (
//             <button
//               onClick={onToggleSidebar}
//               className="p-2 hover:bg-blue-700 rounded-full transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           )}

//           {/* Add Chat Button */}
//           <button
//             onClick={() => setIsUserSearchOpen(true)}
//             className="p-2 hover:bg-blue-700 rounded-full transition-colors"
//           >
//             <Plus className="w-5 h-5" />
//           </button>
//           <div className="relative">
//             {/* FilterIcon Button */}

//             <ChatFilter role={role} totalUnread={totalUnread} />
//           </div>
//         </div>
//       </div>

//       {/* Animated Modal */}
//       <AnimatePresence>
//         {isUserSearchOpen && (
//           <motion.div
//             key="backdrop"
//             className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => setIsUserSearchOpen(false)}
//           >
//             <motion.div
//               key="modal"
//               initial={{ scale: 0.8, opacity: 0, y: 50 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.8, opacity: 0, y: 50 }}
//               transition={{ type: 'spring', stiffness: 300, damping: 25 }}
//               className="bg-white rounded-xl shadow-xl w-full max-w-lg relative p-5"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Close Button */}
//               <button
//                 onClick={() => setIsUserSearchOpen(false)}
//                 className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
//               >
//                 <X className="w-5 h-5" />
//               </button>

//               {/* User Search Component */}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };
