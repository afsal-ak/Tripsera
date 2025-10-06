export enum  EnumBookingStatus {
  PENDING = "pending",
  BOOKED = "booked",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  RESCHEDULED = "rescheduled",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}




export enum  EnumIdType {
  AADHAAR = "aadhaar",
  PAN = "pan",
  PASSPORT = "passport",
}

export enum  EnumTravelerAction {
  ADDED = "added",
  REMOVED = "removed",
  UPDATED = "updated",
}

export enum  EnumDateChangeAction {
  PREPONED = "preponed",
  POSTPONED = "postponed",
}

export enum  EnumBookingHistoryAction {
  TRAVELER_REMOVED = "traveler_removed",
  TRAVELER_ADDED = "traveler_added",
  DATE_CHANGED = "date_changed",
  STATUS_CHANGED = "status_changed",
  AMOUNT_CHANGED = "amount_changed",
}
