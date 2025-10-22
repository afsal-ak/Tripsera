// export enum EnumBookingStatus {
//   PENDING = 'pending',
//   BOOKED = 'booked',
//   CONFIRMED = 'confirmed',
//   PROCESSING = 'processing',
//   RESCHEDULED = 'rescheduled',
//   CANCELLED = 'cancelled',
//   COMPLETED = 'completed',
// }

// export enum EnumIdType {
//   AADHAAR = 'aadhaar',
//   PAN = 'pan',
//   PASSPORT = 'passport',
// }

// export enum EnumTravelerAction {
//   ADDED = 'added',
//   REMOVED = 'removed',
//   UPDATED = 'updated',
// }

// export enum EnumDateChangeAction {
//   PREPONED = 'preponed',
//   POSTPONED = 'postponed',
// }

// export enum EnumBookingHistoryAction {
//   TRAVELER_REMOVED = 'traveler_removed',
//   TRAVELER_ADDED = 'traveler_added',
//   DATE_CHANGED = 'date_changed',
//   STATUS_CHANGED = 'status_changed',
//   AMOUNT_CHANGED = 'amount_changed',
// }
export const EnumBookingStatus = {
  PENDING: 'pending',
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  RESCHEDULED: 'rescheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;
export type EnumBookingStatus = (typeof EnumBookingStatus)[keyof typeof EnumBookingStatus];

// ✅ ID Type
export const EnumIdType = {
  AADHAAR: 'aadhaar',
  PAN: 'pan',
  PASSPORT: 'passport',
} as const;
export type EnumIdType = (typeof EnumIdType)[keyof typeof EnumIdType];

// ✅ Traveler Action
export const EnumTravelerAction = {
  ADDED: 'added',
  REMOVED: 'removed',
  UPDATED: 'updated',
} as const;
export type EnumTravelerAction = (typeof EnumTravelerAction)[keyof typeof EnumTravelerAction];

// ✅ Date Change Action
export const EnumDateChangeAction = {
  PREPONED: 'preponed',
  POSTPONED: 'postponed',
} as const;
export type EnumDateChangeAction = (typeof EnumDateChangeAction)[keyof typeof EnumDateChangeAction];

// ✅ Booking History Action
export const EnumBookingHistoryAction = {
  TRAVELER_REMOVED: 'traveler_removed',
  TRAVELER_ADDED: 'traveler_added',
  DATE_CHANGED: 'date_changed',
  STATUS_CHANGED: 'status_changed',
  AMOUNT_CHANGED: 'amount_changed',
} as const;
export type EnumBookingHistoryAction = (typeof EnumBookingHistoryAction)[keyof typeof EnumBookingHistoryAction];
