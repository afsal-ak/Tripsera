import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import type { IMessage, ISendMessage, IChatRoom } from "@/types/IMessage";
import { getMessagesByRoom } from "@/services/user/messageService";
import { MessageBubble } from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useChatSocket } from "@/hooks/useChatSocket";
import { MessageType } from "@/types/IMessage";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { formatMessageDate } from "@/lib/utils/dateUtils";

import { ChatHeader } from "@/components/chat/ChatHeader";

const MessagePage: React.FC<{ room: IChatRoom; onBack?: () => void }> = ({
  room,
  onBack,
}) => { 
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

  // Sort messages by date (ascending)
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Group messages by date (Today, Yesterday, or Date)
  const groupedMessages = sortedMessages.reduce(
    (groups: Record<string, IMessage[]>, message) => {
      const dateKey = formatMessageDate(message.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(message);
      return groups;
    },
    {}
  );

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

  return (
    <div className="flex flex-col h-full max-h-screen bg-white w-full">
      {/* Messages Section */}
         <ChatHeader 
         room={room} 
         onBack={onBack} 
         isMobile={window.innerWidth < 1024

         } />

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex justify-center my-3">
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm">
                {date}
              </span>
            </div>

            {/* Messages under this date */}
            {groupedMessages[date].map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={
                  typeof message.senderId === "string"
                    ? message.senderId === user?._id
                    : message.senderId?._id === user?._id
                }
                onDelete={deleteMessage}
                currentUser={user || undefined}
              />
            ))}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUser && <TypingIndicator username={typingUser} />}

        {/* Scroll Ref */}
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
