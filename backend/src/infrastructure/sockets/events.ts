export const SOCKET_EVENTS = {
  JOIN_ROOM: "joinroom",
  LEAVE_ROOM: "leaveroom",
  USER_ONLINE: 'userOnline',
  USER_OFFLINE: 'userOffline',
  USER_DISCONNECTED: 'disconnected',
  USER_CONNECTED: 'connected',
  CURRENT_ONLINE_USERS: 'currentOnlineUsers',
  SEND_MESSAGE: "sendMessage",
  NEW_MESSAGE: "message:new",
  DELETE_MESSAGE: "message:delete",
  MESSAGE_DELETED: "message:deleted",
  MARK_AS_READ: "message:markAsRead",
  MESSAGE_READ: "message:read",
  TYPING: "typing",
  STOP_TYPING: "stopTyping",
  MESSAGE_SEND: "message:send",
}
export const SOCKET_WEBRTC_EVENTS = {
  OFFER: "webrtc-offer",
  ANSWER: "webrtc-answer",
  CANDIDATE: "webrtc-candidate",
    END: "webrtc-end",

}


export const SOCKET_NOTIFICATION_EVENTS = {
  JOIN: "notification:join",             // User joins their personal room
  NEW: "notification:new",               // Server emits new notification
  MARK_AS_READ: "notification:markAsRead",
  NOTIFICATION_READ: "notification:read",
  FETCH: "notification:fetch",
  FETCH_RESULT: "notification:fetchResult",
};
