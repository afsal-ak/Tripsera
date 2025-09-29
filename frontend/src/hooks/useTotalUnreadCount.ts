import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export function useTotalUnreadCount(userId: string) {
  return useSelector((state: RootState) =>
    state.chatRoom.rooms.reduce(
      (sum, room) => sum + (room.unreadCounts?.[userId] || 0),
      0
    )
  );
}
