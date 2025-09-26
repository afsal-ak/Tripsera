// import { useState, useEffect, useRef } from "react";
// import { Send, Paperclip } from "lucide-react";
// import type { IMessage, ISendMessage, IChatRoom, IMessageUserInfo } from "@/types/IMessage";
// import { getMessagesByRoom, getChatRoomById } from "@/services/user/messageService";
// import { adminGetMessagesByRoom, adminGetChatRoomById } from "@/services/admin/messageService";
// import { MessageBubble } from "@/components/chat/MessageBubble";
// import TypingIndicator from "@/components/chat/TypingIndicator";
// import { useChatSocket } from "@/hooks/useChatSocket";
// import { MessageType } from "@/types/IMessage";

// import { formatMessageDate } from "@/lib/utils/dateUtils";
// import { ChatHeader } from "@/components/chat/ChatHeader";
// import AttachmentMenu from "@/components/chat/AttachmentMenu";
// import ImageUpload from "@/components/chat/ImageUpload";

// interface Props {
//     roomId: string
//     user: IMessageUserInfo
// }
// import { useDispatch } from "react-redux";
// import { addMessageToRoom, deleteMessageFromRoom, markMessageAsReadInRoom } from "@/redux/slices/chatRoomSlice";


// const MessagePage = ({ roomId, user }: Props) => {

//     const dispatch = useDispatch();

//     const [room, setRoom] = useState<IChatRoom | null>(null);
//     const [messages, setMessages] = useState<IMessage[]>([]);
//     const [isPartnerOnline, setIsPartnerOnline] = useState(false);
//     const [messageInput, setMessageInput] = useState("");
//     const [typingUser, setTypingUser] = useState<string | null>(null);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const [pickedFile, setPickedFile] = useState<File | null>(null);
// const [partnersOnlineStatus, setPartnersOnlineStatus] = useState<Record<string, boolean>>({});

//     const [showMenu, setShowMenu] = useState(false);
//     const [selectedUpload, setSelectedUpload] = useState<"image" | "audio" | "file" | null>(null);
//     //  console.log(user, 'usesr')


//     // Fetch room details
//     useEffect(() => {
//         const fetchRoom = async () => {
//             if (!roomId) {
//                 return;
//             }
//             if (user.role == 'user') {
//                 const response = await getChatRoomById(roomId);
//                 setRoom(response.data);

//             } else if (user.role == 'admin') {
//                 const response = await adminGetChatRoomById(roomId);
//                 setRoom(response.data);

//             }
//         };
//         fetchRoom();
//     }, [roomId]);

//     // Fetch messages for the current room
//     useEffect(() => {
//         if (!roomId) return;
//         const fetchMessages = async () => {
//             if (user.role == 'user') {
//                 const response = await getMessagesByRoom(roomId);
//                 setMessages(response.data);

//             } else if (user.role == 'admin') {
//                 const response = await adminGetMessagesByRoom(roomId);
//                 setMessages(response.data);
//             }
//             scrollToBottom();
//         };
//         fetchMessages();
//     }, [roomId]);

// const partnerId=room?.otherUser?._id
//     const { sendMessage, deleteMessage, startTyping, stopTyping, markAsRead } = useChatSocket({
//         roomId: roomId,
//         currentUserId: user._id!,
//         currentUsername: user.username!,
//         partnerId: room?.otherUser?._id,

//         // onUserOnline: (userId) => {
//         //     if (userId == room?.otherUser?._id) {
//         //         console.log(userId, 'userif ')

//         //         setIsPartnerOnline(true)
//         //     }
//         // },
//         // onUserOffline(userId) {
//         //     if (userId == room?.otherUser?._id) {
//         //         console.log(userId, 'userif ')
//         //         setIsPartnerOnline(false)
//         //     }

//         // },
// onUserOnline: (userId) => {
//     setPartnersOnlineStatus(prev => ({ ...prev, [userId]: true }));
// },
// onUserOffline: (userId) => {
//     setPartnersOnlineStatus(prev => ({ ...prev, [userId]: false }));
// },
//         onMessageReceived: (newMessage: IMessage) => {
//             setMessages((prev) => [...prev, newMessage]);
//             scrollToBottom();

//             // Update Redux for chat list
//             dispatch(addMessageToRoom({ roomId: newMessage.roomId, message: newMessage, currentUserId: user._id! }));
//         },
//         onMessageDeleted: (messageId) => {
//             setMessages((prev) => prev.filter((m) => m._id !== messageId))
//             dispatch(deleteMessageFromRoom({ roomId, messageId, lastMessageContent: 'deletedMessageContent', }))
//         },
//         onMessageRead: (messageId, userId) => {
//             //  markAsRead(messageId)
//             // 1. Update Redux unread count
//             dispatch(markMessageAsReadInRoom({ roomId, userId }));

//             setMessages((prev) =>
//                 prev.map((msg) =>
//                     msg._id === messageId
//                         ? { ...msg, isRead: true } // mark specific msg as read
//                         : msg
//                 )
//             );

//         },

//         onTyping: (_, username) => setTypingUser(username),
//         onStopTyping: () => setTypingUser(null),
//     });


//     // Mark unread messages from others as read

//     // useEffect(() => {
//     //     if (!roomId) return;

//     //     messages.forEach((msg) => {
//     //         if (!msg.isRead && msg.senderId._id !== user._id) {
//     //             markAsRead(msg._id);
//     //         }
//     //     });

//     // }, [messages, roomId, user._id]);
//     const readMessagesRef = useRef<Set<string>>(new Set());

//     useEffect(() => {
//         if (!roomId) return;

//         messages.forEach((msg) => {
//             if (
//                 !msg.isRead &&
//                 msg.senderId._id !== user._id &&
//                 !readMessagesRef.current.has(msg._id)
//             ) {
//                 markAsRead(msg._id);
//                 readMessagesRef.current.add(msg._id);
//             }
//         });
//     }, [messages, roomId, user._id]);

//     // Sort messages by date (ascending)
//     const sortedMessages = [...messages].sort(
//         (a, b) =>
//             new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//     );

//     // Group messages by date (Today, Yesterday, or Date)
//     const groupedMessages = sortedMessages.reduce(
//         (groups: Record<string, IMessage[]>, message) => {
//             const dateKey = formatMessageDate(message.createdAt);
//             if (!groups[dateKey]) groups[dateKey] = [];
//             groups[dateKey].push(message);
//             return groups;
//         },
//         {}
//     );

//     const handleSendMessage = () => {
//         if (!messageInput.trim()) return;

//         const newMessage: ISendMessage = {
//             roomId: room?._id,
//             senderId: user?._id!,
//             content: messageInput,
//             type: MessageType.TEXT,
//         };
//         sendMessage(newMessage);
//         setMessageInput("");
//     };


//     const handleSendImage = (url: string, caption?: string) => {
//         const newMessage: ISendMessage = {
//             roomId: room?._id,
//             senderId: user?._id!,
//             content: caption || '',
//             mediaUrl: url,
//             type: MessageType.IMAGE,
//         };
//         console.log(newMessage, 'new message saad')
//         sendMessage(newMessage);
//     };
//     const scrollToBottom = () => {
//         setTimeout(() => {
//             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 100);
//     };

//     // //for making message read only when tab is open

//     if (!roomId) {
//         return (
//             <div className="flex flex-1 items-center justify-center text-gray-400 text-lg">
//                 Select a chat to start messaging
//             </div>
//         );
//     }
//     //console.log(isPartnerOnline, 'oneline')
//     return (
//         <div className="flex flex-col h-full max-h-screen bg-white w-full">
//             {/* Chat Header */}
//             {room &&
//                 <ChatHeader
//                     room={room}
//     isPartnerOnline={partnersOnlineStatus[room?.otherUser?._id || ''] || false}
//                     isMobile={window.innerWidth < 1024}

//                 />}

//             {/* Messages Section */}
//             <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
//                 {Object.keys(groupedMessages).map((date) => (
//                     <div key={date}>
//                         {/* Date Separator */}
//                         <div className="flex justify-center my-3">
//                             <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm">
//                                 {date}
//                             </span>
//                         </div>

//                         {/* Messages under this date */}
//                         {groupedMessages[date].map((message) => (
//                             <MessageBubble
//                                 key={message._id}
//                                 message={message}
//                                 isOwn={message.senderId?._id === user?._id}
//                                 onDelete={deleteMessage}
//                                 currentUser={user || undefined}
//                                 isPartnerOnline={isPartnerOnline}
//                             // onVisible={handleMessageVisible} 
//                             />
//                         ))}
//                     </div>
//                 ))}
//                 <h1>online {isPartnerOnline}</h1>
//                 {/* Typing Indicator */}
//                 {typingUser && <TypingIndicator username={typingUser} />}

//                 {/* Scroll Ref */}
//                 <div ref={messagesEndRef} />
//             </div>


//             {/* Input Section */}
//             <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200 relative">
//                 <div className="flex items-center gap-2 sm:gap-3">
//                     {/*  Attachment Button */}
//                     <button
//                         onClick={() => setShowMenu(!showMenu)}
//                         className="p-2 rounded-full hover:bg-gray-200"
//                     >
//                         <Paperclip size={20} />
//                     </button>

//                     {showMenu && (
//                         <AttachmentMenu
//                             onSelect={(type) => {
//                                 setShowMenu(false);

//                                 if (type === "image") {
//                                     document.getElementById("hidden-image-input")?.click();

//                                 }

//                                 // if (type === "audio") {
//                                 //     // trigger audio picker
//                                 //     document.getElementById("hidden-audio-input")?.click();
//                                 // }

//                                 // if (type === "file") {
//                                 //     // trigger file picker
//                                 //     document.getElementById("hidden-file-input")?.click();
//                                 // }
//                             }}
//                             onClose={() => setShowMenu(false)}
//                         />
//                     )}

//                     {/* Conditional Upload Components */}
//                     {/* {selectedUpload === "image" && (
//                         <ImageUpload
//                             onUpload={(url,caption) => {
//                                 console.log("Uploaded image and caption:", url,caption);
//                                 handleSendImage(url,caption)
//                                 setSelectedUpload(null);
//                             }}
//                         />
//                     )} */}
//                     {/* Image Upload Modal */}
//                     {selectedUpload === "image" && pickedFile && (
//                         <ImageUpload
//                             file={pickedFile}
//                             onUpload={(url, caption) => {
//                                 console.log("Uploaded image and caption:", url, caption);
//                                 handleSendImage(url, caption);
//                                 setPickedFile(null);
//                                 setSelectedUpload(null);
//                             }}
//                         />
//                     )}
//                     <input
//                         type="file"
//                         id="hidden-image-input"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (!file) return;
//                             setPickedFile(file);   // 👈 store selected file
//                             setSelectedUpload("image");
//                         }}
//                     />
//                     {/* Hidden Inputs for audio/file */}
//                     {/* <input
//                         type="file"
//                         id="hidden-audio-input"
//                         accept="audio/*"
//                         className="hidden"
//                         onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (!file) return;
//                             console.log("Picked audio:", file);
//                             // TODO: upload + send socket
//                         }}
//                     /> */}
//                     {/* <input
//                         type="file"
//                         id="hidden-file-input"
//                         className="hidden"
//                         onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (!file) return;
//                             console.log("Picked file:", file);
//                             // TODO: upload + send socket
//                         }}
//                     /> */}
//                     {/* <input
//                         type="file"
//                         id="hidden-image-input"
//                         className="hidden"
//                         onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (!file) return;
//                             console.log("Picked file:", file);
//                             // TODO: upload + send socket
//                         }}
//                     /> */}

//                     {/*  Message Input */}
//                     <input
//                         type="text"
//                         placeholder="Type your message..."
//                         className="flex-1 rounded-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:ring focus:ring-blue-300 outline-none"
//                         value={messageInput}
//                         onChange={(e) => setMessageInput(e.target.value)}
//                         onKeyDown={(e) => {
//                             startTyping();
//                             if (e.key === "Enter") handleSendMessage();
//                         }}
//                         onBlur={stopTyping}
//                     />

//                     <button
//                         onClick={handleSendMessage}
//                         className="bg-blue-500 text-white p-2 sm:p-3 rounded-full hover:bg-blue-600 transition"
//                     >
//                         <Send size={18} />
//                     </button>
//                 </div>
//             </div>

//             {/* Input Section */}

//         </div>
//     );
// };

// export default MessagePage;
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Paperclip } from "lucide-react";
import type { IMessage, ISendMessage, IChatRoom, IMessageUserInfo } from "@/types/IMessage";
import { getMessagesByRoom, getChatRoomById } from "@/services/user/messageService";
import { adminGetMessagesByRoom, adminGetChatRoomById } from "@/services/admin/messageService";
import { MessageBubble } from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useChatSocket } from "@/hooks/useChatSocket";
import { MessageType } from "@/types/IMessage";

import { formatMessageDate } from "@/lib/utils/dateUtils";
import { ChatHeader } from "@/components/chat/ChatHeader";
import AttachmentMenu from "@/components/chat/AttachmentMenu";
import ImageUpload from "@/components/chat/ImageUpload";

import { useDispatch, useSelector } from "react-redux";
import { addMessageToRoom, deleteMessageFromRoom, markMessageAsReadInRoom } from "@/redux/slices/chatRoomSlice";
import type { RootState } from "@/redux/store";

interface Props {
  roomId: string;
  user: IMessageUserInfo;
}

const MessagePage = ({ roomId, user }: Props) => {
  const dispatch = useDispatch();
const onlineUsers = useSelector((state: RootState) => state.chatRoom.onlineUsers);
console.log(onlineUsers,'online user')
  
  const [room, setRoom] = useState<IChatRoom | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<"image" | "audio" | "file" | null>(null);
  const [partnersOnlineStatus, setPartnersOnlineStatus] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const readMessagesRef = useRef<Set<string>>(new Set());
const isPartnerOnline = room?.otherUser?._id ? onlineUsers.includes(room.otherUser._id) : false;
console.log({isPartnerOnline})
  // --- Fetch room ---
  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;

      if (user.role === "user") {
        const response = await getChatRoomById(roomId);
        setRoom(response.data);
      } else if (user.role === "admin") {
        const response = await adminGetChatRoomById(roomId);
        setRoom(response.data);
      }
    };
    fetchRoom();
  }, [roomId, user.role]);

  // --- Fetch messages ---
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      let response;
      if (user.role === "user") {
        response = await getMessagesByRoom(roomId);
      } else if (user.role === "admin") {
        response = await adminGetMessagesByRoom(roomId);
      }
      setMessages(response.data);
      scrollToBottom();
    };
    fetchMessages();
  }, [roomId, user.role]);

  // --- Memoized socket callbacks ---
  // const handleUserOnline = useCallback((userId: string) => {
  //   setPartnersOnlineStatus((prev) => ({ ...prev, [userId]: true }));
  // }, []);

  // const handleUserOffline = useCallback((userId: string) => {
  //   setPartnersOnlineStatus((prev) => ({ ...prev, [userId]: false }));
  // }, []);

  const handleMessageReceived = useCallback(
    (newMessage: IMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
      dispatch(addMessageToRoom({ roomId: newMessage.roomId, message: newMessage, currentUserId: user._id! }));
    },
    [dispatch, user._id]
  );

  const handleMessageDeleted = useCallback(
    (messageId: string) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      dispatch(deleteMessageFromRoom({ roomId, messageId, lastMessageContent: "deletedMessage" }));
    },
    [dispatch, roomId]
  );

  const handleMessageRead = useCallback(
    (messageId: string, userId: string) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, isRead: true } : msg))
      );
      dispatch(markMessageAsReadInRoom({ roomId, userId }));
    },
    [dispatch, roomId]
  );

  const handleTyping = useCallback((_:any, username: string) => setTypingUser(username), []);
  const handleStopTyping = useCallback(() => setTypingUser(null), []);

  // --- Socket hook ---
 const { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping } = useChatSocket({
  roomId: room?._id,  
  currentUserId: user._id!,
  currentUsername: user.username!,
 // partnerId: room?.otherUser?._id,
  //onUserOnline: handleUserOnline,
  //onUserOffline: handleUserOffline,
  onMessageReceived: handleMessageReceived,
  onMessageDeleted: handleMessageDeleted,
  onMessageRead: handleMessageRead,
  onTyping: handleTyping,
  onStopTyping: handleStopTyping,
});

  // --- Mark messages as read ---
  useEffect(() => {
    messages.forEach((msg) => {
      if (!msg.isRead && msg.senderId._id !== user._id && !readMessagesRef.current.has(msg._id)) {
        markAsRead(msg._id);
        readMessagesRef.current.add(msg._id);
      }
    });
  }, [messages, user._id, markAsRead]);

  // --- Helpers ---
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ISendMessage = {
      roomId: room?._id,
      senderId: user._id!,
      content: messageInput,
      type: MessageType.TEXT,
    };
    sendMessage(newMessage);
    setMessageInput("");
  };

  const handleSendImage = (url: string, caption?: string) => {
    const newMessage: ISendMessage = {
      roomId: room?._id,
      senderId: user._id!,
      content: caption || "",
      mediaUrl: url,
      type: MessageType.IMAGE,
    };
    sendMessage(newMessage);
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const groupedMessages = sortedMessages.reduce(
    (groups: Record<string, IMessage[]>, message) => {
      const dateKey = formatMessageDate(message.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(message);
      return groups;
    },
    {}
  );

  if (!roomId) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400 text-lg">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-screen bg-white w-full">
      {room && (
        <ChatHeader
          room={room}
          isPartnerOnline={room?.otherUser?._id ? onlineUsers.includes(room.otherUser._id) : false}
          isMobile={window.innerWidth < 1024}
        />
      )}

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="flex justify-center my-3">
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm">
                {date}
              </span>
            </div>
            {groupedMessages[date].map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderId?._id === user?._id}
                onDelete={deleteMessage}
                currentUser={user || undefined}
                isPartnerOnline={partnersOnlineStatus[room?.otherUser?._id || ""] || false}
              />
            ))}
          </div>
        ))}

        {typingUser && <TypingIndicator username={typingUser} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200 relative">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <Paperclip size={20} />
          </button>

          {showMenu && (
            <AttachmentMenu
              onSelect={(type) => {
                setShowMenu(false);
                if (type === "image") {
                  document.getElementById("hidden-image-input")?.click();
                }
              }}
              onClose={() => setShowMenu(false)}
            />
          )}

          {selectedUpload === "image" && pickedFile && (
            <ImageUpload
              file={pickedFile}
              onUpload={(url, caption) => {
                handleSendImage(url, caption);
                setPickedFile(null);
                setSelectedUpload(null);
              }}
            />
          )}

          <input
            type="file"
            id="hidden-image-input"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPickedFile(file);
              setSelectedUpload("image");
            }}
          />

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
