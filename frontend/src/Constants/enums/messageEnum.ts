
export const EnumMessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  BLOG: 'blog',
  PACKAGE: 'package',
  AUDIO: 'audio',
  CALL: 'call',
  VIDEO: 'video',
} as const;
export type EnumMessageType = (typeof EnumMessageType)[keyof typeof EnumMessageType];

// ✅ Call Type
export const EnumCallType = {
  AUDIO: 'audio',
  VIDEO: 'video',
  CALL: 'call',
} as const;
export type EnumCallType = (typeof EnumCallType)[keyof typeof EnumCallType];

//  Call Status
export const EnumCallStatus = {
  INITIATED: 'initiated',
  ANSWERED: 'answered',
  MISSED: 'missed',
  ENDED: 'ended',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;
export type EnumCallStatus = (typeof EnumCallStatus)[keyof typeof EnumCallStatus];

// export enum EnumMessageType {
//   TEXT = 'text',
//   IMAGE = 'image',
//   FILE = 'file',
//   BLOG = 'blog',
//   PACKAGE = 'package',
//   AUDIO = 'audio',
//   CALL = 'call',
//   VIDEO = 'video',
// }

// export enum EnumCallType {
//   AUDIO = 'audio',
//   VIDEO = 'video',
//   CALL = 'call',
// }

// export enum EnumCallStatus {
//   INITIATED = 'initiated',
//   ANSWERED = 'answered',
//   MISSED = 'missed',
//   ENDED = 'ended',
//   REJECTED = 'rejected',
//   CANCELLED = 'cancelled',
// }
