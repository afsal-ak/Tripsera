import React from 'react';
import { Check, CheckCheck, Trash2, Video, PhoneMissed } from 'lucide-react';
import type { IMessage, IMessageUserInfo } from '@/types/IMessage';
import ImageViewer from './ImageViewer';
import { ConfirmDialog } from '../ui/ConfirmDialog';
interface Props {
  message: IMessage;
  isOwn: boolean;
  onDelete: (messageId: string) => void;
  currentUser?: IMessageUserInfo;
  isPartnerOnline: boolean;
}

export const MessageBubble: React.FC<Props> = ({ message, isOwn, onDelete, currentUser }) => {
  const formatTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sender = message.senderId || currentUser;
  const senderName = isOwn ? 'You' : sender?.username || 'Unknown';
  const senderAvatar = isOwn ? currentUser?.profileImage?.url : sender?.profileImage 

  const isCall = message.type === 'call';
  const callInfo = message.callInfo;

  const getCallStatusColor = () => {
    if (!callInfo) return 'text-gray-500';
    switch (callInfo.status) {
      case 'answered':
        return 'text-green-400';
      case 'missed':
        return 'text-red-400';
      case 'ended':
        return 'text-gray-400';
      case 'initiated':
        return 'text-blue-400';
      default:
        return 'text-gray-500';
    }
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return null;
    const totalSeconds = parseInt(duration);
    if (isNaN(totalSeconds)) return duration;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  return (
    <div className={`flex items-end mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Partner avatar */}
      {!isOwn && (
        <img
          src={senderAvatar || '/profile-default.jpg'}
          alt={senderName}
          className="w-8 h-8 rounded-full mr-2 shadow-sm"
        />
      )}

      <div
        className={`relative group max-w-[75%] sm:max-w-md px-3 py-2 rounded-2xl shadow-sm ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        {/*  Sender Name */}
        {!isOwn && <p className="text-xs font-semibold text-gray-700 mb-1">{senderName}</p>}

        {/* 🎥 Video Call Message */}
        {isCall ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {callInfo?.status === 'missed' ? (
                <PhoneMissed className={`w-5 h-5 ${getCallStatusColor()}`} />
              ) : (
                <Video className={`w-5 h-5 ${getCallStatusColor()}`} />
              )}

              <div>
                <p className={`text-sm sm:text-base font-medium ${getCallStatusColor()}`}>
                  {callInfo?.status === 'missed'
                    ? 'Missed Video Call'
                    : callInfo?.status === 'answered'
                      ? 'Video Call Answered'
                      : callInfo?.status === 'ended'
                        ? 'Video Call Ended'
                        : callInfo?.status === 'cancelled'
                          ? 'Call Cancelled'
                          : 'Call '}
                </p>

                <p className="text-xs text-gray-300">
                  {callInfo?.status === 'ended'
                    ? formatDuration(callInfo.duration)
                      ? `Duration: ${formatDuration(callInfo.duration)}`
                      : ''
                    : callInfo?.status === 'answered'
                      ? 'On call...'
                      : ''}
                </p>
              </div>
            </div>
          </div>
        ) : message.type === 'image' && message.mediaUrl ? (
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

        {/* Time + Read status */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[11px] ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
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

        {/*  Delete */}
        {isOwn && (
          // <button
          //   onClick={() => onDelete(message._id!)}
          //   className="absolute top-0 right-0 mt-1 mr-1 hidden group-hover:block"
          // >
          //   <Trash2 size={14} className="text-white hover:text-red-400" />
          // </button>
          <div className="absolute top-0 right-0 mt-1 mr-1 hidden group-hover:block">
            <ConfirmDialog
              title="Do you want to  Delete this Message"
              actionLabel="Delete"
              onConfirm={() => onDelete(message._id!)}
            >
              <button>
                <Trash2 size={14} className="text-white hover:text-red-400" />
              </button>
            </ConfirmDialog>
          </div>
        )}
      </div>

      {/* User avatar (own) */}
      {isOwn && (
        <img
          src={senderAvatar || '/profile-default.jpg'}
          alt={senderName}
          className="w-8 h-8 rounded-full ml-2 shadow-sm"
        />
      )}
    </div>
  );
};
