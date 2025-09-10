
// import React, { useState, useEffect, useRef } from "react";
// import { Send } from "lucide-react";
// import type { IMessage, IChatRoom } from "@/types/Message";
// import { getMessagesByRoom } from "@/services/user/messageService";
// import { MessageBubble } from "@/components/chat/MessageBubble";
// import TypingIndicator from "@/components/chat/TypingIndicator";
// import { useChatSocket } from "@/hooks/useChatSocket";
// import { MessageType } from "@/types/Message";
// import type{ RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// const MessagePage: React.FC<{ room: IChatRoom }> = ({ room }) => {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [typingUser, setTypingUser] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const user=useSelector((state:RootState)=>state.userAuth.user)

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

//   // const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
//   //   roomId: room._id,
//   //   currentUserId:user?._id!,
//   //   onMessageReceived: (newMessage) =>
//   //     setMessages((prev) => [...prev, newMessage]),
//   //   onMessageDeleted: (messageId) =>
//   //     setMessages((prev) => prev.filter((m) => m._id !== messageId)),
//   //   onMessageRead: () => {},
//   //   onTyping: (userId) => setTypingUser(userId),
//   //   onStopTyping: () => setTypingUser(null),
//   // });
// const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
//   roomId: room._id,
//      currentUserId:user?._id!,
//   currentUsername:user?.username!,
//   onMessageReceived: (newMessage) =>
//     setMessages((prev) => [...prev, newMessage]),  // ✅ Instantly append messages
//   onMessageDeleted: (messageId) =>
//     setMessages((prev) => prev.filter((m) => m._id !== messageId)),
//   onMessageRead: () => {},
//   onTyping: (_, username) => setTypingUser(username),
//   onStopTyping: () => setTypingUser(null),
// });

//   const handleSendMessage = () => {
//     if (!messageInput.trim()) return;

//     const newMessage: Partial<IMessage> = {
//       roomId: room._id,
//       senderId: user?._id as any,
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
//             isOwn={message?.senderId._id === user?._id}
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

// import React, { useState, useEffect, useRef } from "react";
// import { Send } from "lucide-react";
// import type { IMessage, IChatRoom } from "@/types/Message";
// import { getMessagesByRoom } from "@/services/user/messageService";
// import { MessageBubble } from "@/components/chat/MessageBubble";
// import TypingIndicator from "@/components/chat/TypingIndicator";
// import { useChatSocket } from "@/hooks/useChatSocket";
// import { MessageType } from "@/types/Message";
// import type{ RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// const MessagePage: React.FC<{ room: IChatRoom }> = ({ room }) => {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [typingUser, setTypingUser] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const user=useSelector((state:RootState)=>state.userAuth.user)

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

//   // const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
//   //   roomId: room._id,
//   //   currentUserId:user?._id!,
//   //   onMessageReceived: (newMessage) =>
//   //     setMessages((prev) => [...prev, newMessage]),
//   //   onMessageDeleted: (messageId) =>
//   //     setMessages((prev) => prev.filter((m) => m._id !== messageId)),
//   //   onMessageRead: () => {},
//   //   onTyping: (userId) => setTypingUser(userId),
//   //   onStopTyping: () => setTypingUser(null),
//   // });
// const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
//   roomId: room._id,
//      currentUserId:user?._id!,
//   currentUsername:user?.username!,
//   onMessageReceived: (newMessage) =>
//     setMessages((prev) => [...prev, newMessage]),  // ✅ Instantly append messages
//   onMessageDeleted: (messageId) =>
//     setMessages((prev) => prev.filter((m) => m._id !== messageId)),
//   onMessageRead: () => {},
//   onTyping: (_, username) => setTypingUser(username),
//   onStopTyping: () => setTypingUser(null),
// });

//   const handleSendMessage = () => {
//     if (!messageInput.trim()) return;

//     const newMessage: Partial<IMessage> = {
//       roomId: room._id,
//       senderId: user?._id as any,
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
//             isOwn={message?.senderId._id === user?._id}
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

import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import type { IMessage,ISendMessage, IChatRoom } from "@/types/IMessage";
import { getMessagesByRoom } from "@/services/user/messageService";
import { MessageBubble } from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useChatSocket } from "@/hooks/useChatSocket";
import { MessageType } from "@/types/IMessage";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
const MessagePage: React.FC<{ room: IChatRoom }> = ({ room }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.userAuth.user)

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

console.log(user?._id,'user id')
console.log(messages,'sender id')
  const { sendMessage, deleteMessage, startTyping, stopTyping } = useChatSocket({
    roomId: room._id,
    currentUserId: user?._id!,
    currentUsername: user?.username!,
    onMessageReceived: (newMessage) =>
      setMessages((prev) => [...prev, newMessage]),  // ✅ Instantly append messages
    onMessageDeleted: (messageId) =>
      setMessages((prev) => prev.filter((m) => m._id !== messageId)),
    onMessageRead: () => { },
    onTyping: (_, username) => setTypingUser(username),
    onStopTyping: () => setTypingUser(null),
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ISendMessage = {
      roomId: room._id,
      senderId: user?._id! ,
      content: messageInput,
      type: MessageType.TEXT,
    };

    sendMessage(newMessage);
    setMessageInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={message.sender?._id == user?._id}
            onDelete={deleteMessage}
          />
        ))}
        {typingUser && <TypingIndicator username={user?.username!} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
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
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
