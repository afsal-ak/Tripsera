export const SOCKET_EVENTS = {
  JOIN_ROOM: "joinroom",
  LEAVE_ROOM: "leaveroom",
  SEND_MESSAGE: "sendMessage",
  NEW_MESSAGE: "message:new",
  DELETE_MESSAGE: "message:delete",
MESSAGE_DELETED: "message:deleted",
  MARK_AS_READ: "message:markAsRead",
  MESSAGE_READ: "message:read",
  TYPING: "typing",
  STOP_TYPING: "stopTyping",
MESSAGE_SEND:"message:send",
}
 

// export const SOCKET_NOTIFICATION_EVENTS = {
//   JOIN: "notification:join",
//   NEW: "notification:new",
//   MARK_AS_READ: "notification:markAsRead",
//   NOTIFICATION_READ: "notification:read",
// };


export const SOCKET_NOTIFICATION_EVENTS = {
  JOIN: "notification:join",             // User joins their personal room
  NEW: "notification:new",               // Server emits new notification
  MARK_AS_READ: "notification:markAsRead",
  NOTIFICATION_READ: "notification:read",
  FETCH: "notification:fetch",
  FETCH_RESULT: "notification:fetchResult",
};
