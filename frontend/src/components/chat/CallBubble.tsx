import React from "react";
import type { ICall } from "@/types/ICall";

interface Props {
  call: ICall & { itemType: "call" };
  currentUserId: string;
}

export const CallBubble: React.FC<Props> = ({ call, currentUserId }) => {
  const isOwnCall = call.callerId === currentUserId;
  const callerLabel = isOwnCall ? "You" : "Caller";
  const receiverLabel = isOwnCall ? "Receiver" : "You";

  const formatTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex items-end mb-3 ${isOwnCall ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[75%] sm:max-w-md md:max-w-lg px-3 py-2 rounded-2xl shadow-sm ${
          isOwnCall ? "bg-green-500 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="text-sm font-semibold">
          {call.callType.toUpperCase()} Call ({call.status})
        </p>
        <p className="text-xs">
          {callerLabel}: {call.callerId} <br />
          {receiverLabel}: {call.receiverId}
        </p>
        <div className="flex justify-end text-[11px] mt-1">
          <span>{formatTime(call.startedAt!)}</span>
        </div>
      </div>
    </div>
  );
};
