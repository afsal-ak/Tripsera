export const TripTypeEnum = {
  ROMANTIC: 'romantic',
  ADVENTURE: 'adventure',
  FAMILY: 'family',
  LUXURY: 'luxury',
  BUDGET: 'budget',
  OTHER: 'other',
} as const;
export type TripTypeEnum = (typeof TripTypeEnum)[keyof typeof TripTypeEnum];

// ✅ Accommodation Type
export const AccommodationTypeEnum = {
  LUXURY: 'luxury',
  STANDARD: 'standard',
  BUDGET: 'budget',
} as const;
export type AccommodationTypeEnum = (typeof AccommodationTypeEnum)[keyof typeof AccommodationTypeEnum];

// ✅ Custom Package Status
export const CustomPkgStatusEnum = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
export type CustomPkgStatusEnum = (typeof CustomPkgStatusEnum)[keyof typeof CustomPkgStatusEnum];
