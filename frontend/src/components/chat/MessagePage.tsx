import { useState, useEffect, useRef } from "react";
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

interface Props {
    roomId: string
    user: IMessageUserInfo
}
import { useDispatch } from "react-redux";
import { addMessageToRoom, deleteMessageFromRoom, markMessageAsReadInRoom } from "@/redux/slices/chatRoomSlice";


const MessagePage = ({ roomId, user }: Props) => {

    const dispatch = useDispatch();

    const [room, setRoom] = useState<IChatRoom | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [pickedFile, setPickedFile] = useState<File | null>(null);

    const [showMenu, setShowMenu] = useState(false);
    const [selectedUpload, setSelectedUpload] = useState<"image" | "audio" | "file" | null>(null);
    //  console.log(user, 'usesr')


    // Fetch room details
    useEffect(() => {
        const fetchRoom = async () => {
            if (!roomId) {
                return;
            }
            if (user.role == 'user') {
                const response = await getChatRoomById(roomId);
                setRoom(response.data);

            } else if (user.role == 'admin') {
                const response = await adminGetChatRoomById(roomId);
                setRoom(response.data);

            }
        };
        fetchRoom();
    }, [roomId]);

    // Fetch messages for the current room
    useEffect(() => {
        if (!roomId) return;
        const fetchMessages = async () => {
            if (user.role == 'user') {
                const response = await getMessagesByRoom(roomId);
                setMessages(response.data);

            } else if (user.role == 'admin') {
                const response = await adminGetMessagesByRoom(roomId);
                setMessages(response.data);
            }
            scrollToBottom();
        };
        fetchMessages();
    }, [roomId]);


    const { sendMessage, deleteMessage, startTyping, stopTyping, markAsRead } = useChatSocket({
        roomId: roomId,
        currentUserId: user._id!,
        currentUsername: user.username!,
        onMessageReceived: (newMessage: IMessage) => {
            setMessages((prev) => [...prev, newMessage]);
            scrollToBottom();

            // Update Redux for chat list
            dispatch(addMessageToRoom({ roomId: newMessage.roomId, message: newMessage, currentUserId: user._id! }));
        },
        onMessageDeleted: (messageId) => {
            setMessages((prev) => prev.filter((m) => m._id !== messageId))
            dispatch(deleteMessageFromRoom({ roomId, messageId }))
        } // update Redux for chat list
        ,
        //onMessageRead: (messageId,currentUserId) => {},
        onMessageRead: (messageId, userId) => {
            //  markAsRead(messageId)
            // 1. Update Redux unread count
            dispatch(markMessageAsReadInRoom({ roomId, userId }));
            markAsRead(messageId)
            setMessages((prev) =>
                prev.map((m) =>
                    m._id === messageId && !m.readBy?.includes(user._id!)
                        ? { ...m, readBy: [...(m.readBy || []), user._id!] }
                        : m
                )
            );

        },

        onTyping: (_, username) => setTypingUser(username),
        onStopTyping: () => setTypingUser(null),
    });
    // Mark unread messages from others as read
    useEffect(() => {
        messages.forEach((msg) => {
            console.log(msg, 'message fromusefe')
            // const senderId = typeof msg.senderId === "string" ? msg.senderId : msg.senderId?._id;
            const senderId = msg.senderId._id
            console.log(senderId, 'kdssdA')
            console.log(user._id, 'curent')

            if (!msg.isRead && senderId !== user._id) {
                console.log(' read true')
                markAsRead(msg._id); // emit to server
            }
        });
    }, [messages, user._id]);


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
            roomId: room?._id,
            senderId: user?._id!,
            content: messageInput,
            type: MessageType.TEXT,
        };
        sendMessage(newMessage);
        setMessageInput("");
    };


    const handleSendImage = (url: string, caption?: string) => {
        const newMessage: ISendMessage = {
            roomId: room?._id,
            senderId: user?._id!,
            content: caption || '',
            mediaUrl: url,
            type: MessageType.IMAGE,
        };
        console.log(newMessage, 'new message saad')
        sendMessage(newMessage);
    };
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // //for making message read only when tab is open
    // const handleMessageVisible = (messageId: string) => {
    //     if (document.hidden) {
    //         return; //  don't mark if tab not active
    //     }

    //     markAsRead(messageId);       // emit to server
    // };
    if (!roomId) {
        return (
            <div className="flex flex-1 items-center justify-center text-gray-400 text-lg">
                Select a chat to start messaging
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-h-screen bg-white w-full">
            {/* Chat Header */}
            {room && <ChatHeader room={room} isMobile={window.innerWidth < 1024} />}

            {/* Messages Section */}
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
                                isOwn={message.senderId?._id === user?._id}
                                onDelete={deleteMessage}
                                currentUser={user || undefined}
                            // onVisible={handleMessageVisible} 
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
            <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200 relative">
                <div className="flex items-center gap-2 sm:gap-3">
                    {/*  Attachment Button */}
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

                                // if (type === "audio") {
                                //     // trigger audio picker
                                //     document.getElementById("hidden-audio-input")?.click();
                                // }

                                // if (type === "file") {
                                //     // trigger file picker
                                //     document.getElementById("hidden-file-input")?.click();
                                // }
                            }}
                            onClose={() => setShowMenu(false)}
                        />
                    )}

                    {/* Conditional Upload Components */}
                    {/* {selectedUpload === "image" && (
                        <ImageUpload
                            onUpload={(url,caption) => {
                                console.log("Uploaded image and caption:", url,caption);
                                handleSendImage(url,caption)
                                setSelectedUpload(null);
                            }}
                        />
                    )} */}
                    {/* Image Upload Modal */}
                    {selectedUpload === "image" && pickedFile && (
                        <ImageUpload
                            file={pickedFile}
                            onUpload={(url, caption) => {
                                console.log("Uploaded image and caption:", url, caption);
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
                            setPickedFile(file);   // 👈 store selected file
                            setSelectedUpload("image");
                        }}
                    />
                    {/* Hidden Inputs for audio/file */}
                    {/* <input
                        type="file"
                        id="hidden-audio-input"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            console.log("Picked audio:", file);
                            // TODO: upload + send socket
                        }}
                    /> */}
                    {/* <input
                        type="file"
                        id="hidden-file-input"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            console.log("Picked file:", file);
                            // TODO: upload + send socket
                        }}
                    /> */}
                    {/* <input
                        type="file"
                        id="hidden-image-input"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            console.log("Picked file:", file);
                            // TODO: upload + send socket
                        }}
                    /> */}

                    {/*  Message Input */}
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

            {/* Input Section */}

        </div>
    );
};

export default MessagePage;
