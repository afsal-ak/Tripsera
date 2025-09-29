import React, { useEffect, useRef } from "react";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import type { IMessage, IMessageUserInfo } from "@/types/IMessage";
import ImageViewer from "./ImageViewer";
interface Props {
  message: IMessage;
  isOwn: boolean;
  onDelete: (messageId: string) => void;
  currentUser?: IMessageUserInfo;
  isPartnerOnline: Boolean

 }

export const MessageBubble: React.FC<Props> = ({
  message,
  isOwn,
  onDelete,
  currentUser,
   

}) => {
  // Format time like WhatsApp (HH:MM AM/PM)
  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  //console.log(message,'mssg')
  // Sender details
  const sender = message.senderId || currentUser;

  const senderName = isOwn ? "You" : sender?.username || "Unknown";
  const senderAvatar = isOwn
    ? currentUser?.profileImage?.url
    : sender?.profileImage?.url;

  return (
    <div
      className={`flex items-end mb-3 ${isOwn ? "justify-end" : "justify-start"
        }`}
    >
      {/* Left Avatar for other users */}
      {!isOwn && (
        <img
          src={senderAvatar || "/profile-default.jpg"}
          alt={senderName}
          className="w-8 h-8 rounded-full mr-2 shadow-sm"
        />
      )}

      {/* Chat Bubble */}
      <div
        className={`relative group max-w-[75%] sm:max-w-md md:max-w-lg px-3 py-2 rounded-2xl shadow-sm ${isOwn
          ? "bg-blue-500 text-white rounded-br-none"
          : "bg-gray-200 text-gray-900 rounded-bl-none"
          }`}
      >
        {/* Show sender name only for others */}
        {!isOwn && (
          <p className="text-xs font-semibold text-gray-700 mb-1">
            {senderName}
          </p>
        )}

        {message.type === "image" && message.mediaUrl ? (
          <div className="flex flex-col max-w-xs sm:max-w-sm">
           
            <ImageViewer src={message.mediaUrl} className="max-w-xs sm:max-w-sm" />

            {message.content?.trim() && (
              <p className="mt-1 text-xs sm:text-sm text-black-200 break-words">
                {message.content}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm sm:text-base break-words">{message.content}</p>
        )}

        {/* Timestamp + Read Status */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[11px] ${isOwn ? "text-blue-100" : "text-gray-500"
            }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwn &&
            (message.isRead ? (
              <CheckCheck className="w-4 h-4 text-blue-300" />
            ) : (
              <Check className="w-4 h-4 text-gray-300" />
            ))}
        </div>

        {/* Delete button (visible on hover only) */}
        {isOwn && (
          <button
            onClick={() => onDelete(message._id)}
            className="absolute top-0 right-0 mt-1 mr-1 hidden group-hover:block"
          >
            <Trash2 size={14} className="text-white hover:text-red-400" />
          </button>
        )}
      </div>

      {/* Right Avatar for current user */}
      {isOwn && (
        <img
          src={senderAvatar || "/profile-default.jpg"}
          alt={senderName}
          className="w-8 h-8 rounded-full ml-2 shadow-sm"
        />
      )}
    </div>
  );
};
