export const EnumNotificationType = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error',
  REQUEST: 'request',
  ALERT: 'alert',
} as const;
export type EnumNotificationType = (typeof EnumNotificationType)[keyof typeof EnumNotificationType];

export const EnumNotificationEntityType = {
  BOOKING: 'booking',
  PACKAGE: 'package',
  CUSTOM_PACKAGE: 'customPackage',
  REVIEW: 'review',
  WALLET: 'wallet',
  REPORT: 'report',
  FOLLOW: 'follow',
} as const;
export type EnumNotificationEntityType = (typeof EnumNotificationEntityType)[keyof typeof EnumNotificationEntityType];

// export enum EnumNotificationType {
//   INFO = 'info',
//   WARNING = 'warning',
//   SUCCESS = 'success',
//   ERROR = 'error',
//   REQUEST = 'request',
//   ALERT = 'alert',
// }

// export enum EnumNotificationEntityType {
//   BOOKING = 'booking',
//   PACKAGE = 'package',
//   CUSTOM_PACKAGE = 'customPackage',
//   REVIEW = 'review',
//   WALLET = 'wallet',
//   REPORT = 'report',
//   FOLLOW = 'follow',
// }
