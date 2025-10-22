// export enum EnumChatRoomSort {
//   ALL = 'all',
//   READ = 'read',
//   UNREAD = 'unread',
// }
export const EnumChatRoomSort = {
  ALL: 'all',
  READ: 'read',
  UNREAD: 'unread',
} as const;
export type EnumChatRoomSort = (typeof EnumChatRoomSort)[keyof typeof EnumChatRoomSort];
