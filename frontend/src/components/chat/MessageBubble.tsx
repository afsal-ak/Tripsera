// // //  import type { IMessage } from "@/types/Message";

// // // import { Check,CheckCheck } from "lucide-react";
// // // // Message Bubble Component
// // // export const MessageBubble: React.FC<{ 
// // //   message: IMessage; 
// // //   isOwn: boolean;
// // //   senderName?: string;
// // // }> = ({ message, isOwn, senderName }) => {
// // //   const formatTime = (date: Date) => {
// // //     return new Date(date).toLocaleTimeString('en-US', { 
// // //       hour: '2-digit', 
// // //       minute: '2-digit', 
// // //       hour12: false 
// // //     });
// // //   };

// // //   const getStatusIcon = () => {
// // //     if (!isOwn) return null;
    
// // //     if (message.isRead) {
// // //       return <CheckCheck className="w-4 h-4 text-blue-400" />;
// // //     } else {
// // //       return <Check className="w-4 h-4 text-gray-400" />;
// // //     }
// // //   };

// // //   return (
// // //     <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
// // //       <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
// // //         isOwn 
// // //           ? 'bg-blue-500 text-white' 
// // //           : 'bg-white text-gray-800 shadow-sm border'
// // //       }`}>
// // //         {!isOwn && senderName && (
// // //           <p className="text-xs text-blue-500 font-medium mb-1">{senderName}</p>
// // //         )}
// // //         <p className="text-sm leading-relaxed">{message.content}</p>
// // //         <div className={`flex items-center justify-end mt-1 space-x-1 ${
// // //           isOwn ? 'text-blue-200' : 'text-gray-500'
// // //         }`}>
// // //           <span className="text-xs">{formatTime(message.createdAt)}</span>
// // //           {getStatusIcon()}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // import React from "react";
// // import { Trash2, Check, CheckCheck } from "lucide-react";
// // import type{ IMessage } from "@/types/Message";

// // interface MessageBubbleProps {
// //   message: IMessage;
// //   isOwn: boolean;
// //   onDelete?: (messageId: string) => void;
// // }

// // export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, onDelete }) => {
// //   return (
// //     <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
// //       <div
// //         className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
// //           isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
// //         }`}
// //       >
// //         <div className="flex items-center justify-between gap-2">
// //           <p className="break-words">{message.content}</p>
// //           {isOwn && onDelete && (
// //             <button
// //               onClick={() => onDelete(message._id)}
// //               className="ml-2 text-xs hover:text-red-600"
// //             >
// //               <Trash2 size={14} />
// //             </button>
// //           )}
// //         </div>

// //         {/* Read receipts */}
// //         {isOwn && (
// //           <div className="flex justify-end mt-1 text-xs">
// //             {message.readBy?.length > 1 ? (
// //               <CheckCheck className="w-4 h-4 text-green-400" />
// //             ) : (
// //               <Check className="w-4 h-4 text-gray-300" />
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };
// import React from "react";
// import type { IMessage } from "@/types/Message";
// import { Trash2 } from "lucide-react";

// interface Props {
//   message: IMessage;
//   isOwn: boolean;
//   onDelete: (messageId: string) => void;
// }
// export const MessageBubble: React.FC<Props> = ({ message, isOwn, onDelete }) => {
 
//   return (
//     <div
//       className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 group`}
//     >
//       <div
//         className={`relative px-4 py-2 rounded-lg max-w-xs break-words ${
//           isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
//         }`}
//       >
//         <p>{message.content}</p>
//         {isOwn && (
//           <button
//             onClick={() => onDelete(message._id)}
//             className="absolute top-0 right-0 mt-1 mr-1 hidden group-hover:block"
//           >
//             <Trash2 size={14} className="text-white hover:text-red-400" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

import React from "react";
import type { IMessage } from "@/types/Message";
import { Trash2 } from "lucide-react";

interface Props {
  message: IMessage;
  isOwn: boolean;
  onDelete: (messageId: string) => void;
}

export const MessageBubble: React.FC<Props> = ({ message, isOwn, onDelete }) => {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 group`}
    >
      <div
        className={`relative px-3 sm:px-4 py-2 rounded-lg max-w-[75%] sm:max-w-md md:max-w-lg break-words ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        <p className="text-sm sm:text-base">{message.content}</p>
        {isOwn && (
          <button
            onClick={() => onDelete(message._id)}
            className="absolute top-0 right-0 mt-1 mr-1 hidden group-hover:block"
          >
            <Trash2 size={14} className="text-white hover:text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
};
