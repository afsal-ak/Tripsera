
// import React, { useState, useEffect, useRef } from "react";
// import { Send } from "lucide-react";
// import type { IMessage,ISendMessage, IChatRoom } from "@/types/Message";
// import { getMessagesByRoom } from "@/services/user/messageService";
// import { MessageBubble } from "@/components/chat/MessageBubble";
// import TypingIndicator from "@/components/chat/TypingIndicator";
// import { useChatSocket } from "@/hooks/useChatSocket";
// import { MessageType } from "@/types/Message";
// import type { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// const MessagePage: React.FC<{ room: IChatRoom }> = ({ room }) => {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [typingUser, setTypingUser] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const user = useSelector((state: RootState) => state.userAuth.user)

//   useEffect(() => {
//     const fetchMessages = async () => {
//       const response = await getMessagesByRoom(room._id);
//       setMessages(response.data);
//     };
//     fetchMessages();
//   }, [room._id]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

// console.log(user?._id,'user id')
// console.log(messages,'sender id')
//   const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
//     roomId: room._id,
//     currentUserId: user?._id!,
//     currentUsername: user?.username!,
//     onMessageReceived: (newMessage) =>
//       setMessages((prev) => [...prev, newMessage]),  
//     onMessageDeleted: (messageId) =>
//       setMessages((prev) => prev.filter((m) => m._id !== messageId)),
//     onMessageRead: () => { },
//     onTyping: (_, username) => setTypingUser(username),
//     onStopTyping: () => setTypingUser(null),
//   });

//   const handleSendMessage = () => {
//     if (!messageInput.trim()) return;

//     const newMessage: ISendMessage = {
//       roomId: room._id,
//       senderId: user?._id! ,
//       content: messageInput,
//       type: MessageType.TEXT,
//     };

//     sendMessage(newMessage);
//     setMessageInput("");
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((message) => (
//           <MessageBubble
//             key={message._id}
//             message={message}
// isOwn={
//   typeof message.senderId === "string"
//     ? message.senderId === user?._id
//     : message.senderId?._id === user?._id
// }
//             onDelete={deleteMessage}
//           />
//         ))}
//         {typingUser && <TypingIndicator username={user?.username!} />}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-4 bg-gray-50 border-t border-gray-200">
//         <div className="flex items-center space-x-3">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             onKeyDown={(e) => {
//               startTyping();
//               if (e.key === "Enter") handleSendMessage();
//             }}
//             onBlur={stopTyping}
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
//           >
//             <Send size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagePage;

// import { useState, useEffect, useRef } from "react";
// import { Send } from "lucide-react";
// import type { IMessage, ISendMessage, IChatRoom } from "@/types/Message";
// import { getMessagesByRoom } from "@/services/user/messageService";
// import { MessageBubble } from "@/components/chat/MessageBubble";
// import TypingIndicator from "@/components/chat/TypingIndicator";
// import { useChatSocket } from "@/hooks/useChatSocket";
// import { MessageType } from "@/types/Message";
// import type { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";

// interface MessagePageProps {
//   room: IChatRoom;
//   className?: string;
//   style?: React.CSSProperties;
//   showHeader?: boolean;
//   onBack?: () => void;
// }

// export default function MessagePage({
//   room,
//   className = "",
//   style,
//   showHeader = true,
//   onBack,
// }: MessagePageProps) {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [typingUser, setTypingUser] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const user = useSelector((state: RootState) => state.userAuth.user);

//   // Fetch initial messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await getMessagesByRoom(room._id);
//         setMessages(response.data);
//       } catch (error) {
//         console.error("Failed to fetch messages:", error);
//       }
//     };
//     fetchMessages();
//   }, [room._id]);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
//     roomId: room._id,
//     currentUserId: user?._id!,
//     currentUsername: user?.username!,
//     onMessageReceived: (newMessage) =>
//       setMessages((prev) => [...prev, newMessage]),
//     onMessageDeleted: (messageId) =>
//       setMessages((prev) => prev.filter((m) => m._id !== messageId)),
//     onMessageRead: () => {},
//     onTyping: (_, username) => setTypingUser(username),
//     onStopTyping: () => setTypingUser(null),
//   });

//   const handleSendMessage = () => {
//     if (!messageInput.trim()) return;

//     const newMessage: ISendMessage = {
//       roomId: room._id,
//       senderId: user?._id!,
//       content: messageInput,
//       type: MessageType.TEXT,
//     };

//     sendMessage(newMessage);
//     setMessageInput("");
//   };
// //  console.log(messages.map((s)=>s.senderId._id),'mesassasasa')
//  console.log(user?._id,'mesassasasa')

//   return (
//     <div
//       className={`flex flex-col h-full bg-white ${className}`}
//       style={style}
//     >
//       {/* Optional Header */}
//       {showHeader && (
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
//           {onBack && (
//             <button
//               onClick={onBack}
//               className="text-blue-500 font-semibold hover:underline"
//             >
//               Back
//             </button>
//           )}
//           <h2 className="text-lg font-semibold text-gray-800 truncate">
//             {room.name || "Chat"}
//           </h2>
//           <div />
//         </div>
//       )}

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.length > 0 ? (
//           messages.map((message) => (
//             <MessageBubble
//               key={message._id}
//               message={message}
//               isOwn={message.senderId?._id === user?._id}
//               onDelete={deleteMessage}
//               //showTimestamp
//              // rounded="2xl"
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-500 mt-8">
//             No messages yet. Start the conversation!
//           </p>
//         )}

//         {typingUser && typingUser !== user?.username && (
//           <TypingIndicator username={typingUser} />
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-4 bg-gray-50 border-t border-gray-200">
//         <div className="flex items-center space-x-3">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             onKeyDown={(e) => {
//               startTyping();
//               if (e.key === "Enter") handleSendMessage();
//             }}
//             onBlur={stopTyping}
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
//           >
//             <Send size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect, useRef } from "react";
// import { Send, ArrowLeft } from "lucide-react";
// import type { IMessage, ISendMessage, IChatRoom } from "@/types/Message";
// import { getMessagesByRoom } from "@/services/user/messageService";
// import { useChatSocket } from "@/hooks/useChatSocket";
// import { MessageType } from "@/types/Message";
// import type { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// import TypingIndicator from "@/components/chat/TypingIndicator";

// interface MessagePageProps {
//   room: IChatRoom;
//   className?: string;
//   style?: React.CSSProperties;
//   showHeader?: boolean;
//   onBack?: () => void;
//     showBackButton?: boolean;  

// }

// export default function MessagePage({
//   room,
//   className = "",
//   style,
//   showHeader = true,
//   onBack,
// }: MessagePageProps) {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [typingUser, setTypingUser] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const user = useSelector((state: RootState) => state.userAuth.user);

//   // Fetch initial messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await getMessagesByRoom(room._id);
//         setMessages(response.data);
//       } catch (error) {
//         console.error("Failed to fetch messages:", error);
//       }
//     };
//     fetchMessages();
//   }, [room._id]);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
//     roomId: room._id,
//     currentUserId: user?._id!,
//     currentUsername: user?.username!,
//     onMessageReceived: (newMessage) =>
//       setMessages((prev) => [...prev, newMessage]),
//     onMessageDeleted: (messageId) =>
//       setMessages((prev) => prev.filter((m) => m._id !== messageId)),
//     onMessageRead: () => {},
//     onTyping: (_, username) => setTypingUser(username),
//     onStopTyping: () => setTypingUser(null),
//   });

//   const handleSendMessage = () => {
//     if (!messageInput.trim()) return;

//     const newMessage: ISendMessage = {
//       roomId: room._id,
//       senderId: user?._id!,
//       content: messageInput,
//       type: MessageType.TEXT,
//     };

//     sendMessage(newMessage);
//     setMessageInput("");
//   };

//   return (
//     <div
//       className={`flex flex-col h-full bg-gray-100 ${className}`}
//       style={style}
//     >
//       {/* Navbar */}
//       {showHeader && (
//         <div className="flex items-center p-3 bg-blue-500 text-white shadow-md">
//           {onBack && (
//             <button
//               onClick={onBack}
//               className="mr-3 p-2 rounded-full hover:bg-blue-600"
//             >
//               <ArrowLeft size={22} />
//             </button>
//           )}
//           <div className="flex items-center gap-3">
//             {/* <img
//               src={room?.participants || "/default-avatar.png"}
//               alt="avatar"
//               className="w-10 h-10 rounded-full border"
//             /> */}
//             <div>
//               <h2 className="text-lg font-semibold">
//                 {room.name || "Chat"}
//               </h2>
//               {typingUser && typingUser !== user?.username && (
//                 <p className="text-sm text-green-200">typing...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {messages.length > 0 ? (
//           messages.map((message) => {
//   const isOwn = message.senderIdd === user?._id;

//             return (
//               <div
//                 key={message._id}
//                 className={`flex ${
//                   isOwn ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
//                     isOwn
//                       ? "bg-green-500 text-white rounded-br-none"
//                       : "bg-white text-gray-800 rounded-bl-none"
//                   }`}
//                 >
//                   <p>{message.content}</p>
//                   <span className="text-xs opacity-60 block mt-1 text-right">
//                     {new Date(message.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p className="text-center text-gray-500 mt-8">
//             No messages yet. Start the conversation!
//           </p>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-3 bg-white border-t border-gray-200">
//         <div className="flex items-center space-x-3">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             onKeyDown={(e) => {
//               startTyping();
//               if (e.key === "Enter") handleSendMessage();
//             }}
//             onBlur={stopTyping}
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
//           >
//             <Send size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import type { IMessage, ISendMessage, IChatRoom } from "@/types/Message";
import { getMessagesByRoom } from "@/services/user/messageService";
import { MessageBubble } from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useChatSocket } from "@/hooks/useChatSocket";
import { MessageType } from "@/types/Message";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const MessagePage: React.FC<{ room: IChatRoom }> = ({ room }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.userAuth.user);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await getMessagesByRoom(room._id);
      setMessages(response.data);
    };
    fetchMessages();
  }, [room._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
    roomId: room._id,
    currentUserId: user?._id!,
    currentUsername: user?.username!,
    onMessageReceived: (newMessage) =>
      setMessages((prev) => [...prev, newMessage]),
    onMessageDeleted: (messageId) =>
      setMessages((prev) => prev.filter((m) => m._id !== messageId)),
    onMessageRead: () => {},
    onTyping: (_, username) => setTypingUser(username),
    onStopTyping: () => setTypingUser(null),
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ISendMessage = {
      roomId: room._id,
      senderId: user?._id!,
      content: messageInput,
      type: MessageType.TEXT,
    };

    sendMessage(newMessage);
    setMessageInput("");
  };
console.log(user?.username,'username')
  return (
    <div className="flex flex-col h-full max-h-screen bg-white w-full">
      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={
              typeof message.senderId === "string"
                ? message.senderId === user?._id
                : message.senderId?._id === user?._id
            }
            onDelete={deleteMessage}
          />
        ))}
{typingUser && <TypingIndicator username={typingUser} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:ring focus:ring-blue-300 outline-none"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              startTyping();
              if (e.key === "Enter") handleSendMessage();
            }}
            onBlur={stopTyping}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 sm:p-3 rounded-full hover:bg-blue-600 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
