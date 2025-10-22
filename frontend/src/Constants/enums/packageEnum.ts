
export const EnumPackageStatus = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
} as const;
export type EnumPackageStatus = (typeof EnumPackageStatus)[keyof typeof EnumPackageStatus];

// ✅ Offer Type (Duplicate)
export const OfferTypeEnum = {
  PERCENTAGE: 'percentage',
  FLAT: 'flat',
} as const;
export type OfferTypeEnum = (typeof OfferTypeEnum)[keyof typeof OfferTypeEnum];

// ✅ Location Type
export const LocationTypeEnum = {
  POINT: 'Point',
} as const;
export type LocationTypeEnum = (typeof LocationTypeEnum)[keyof typeof LocationTypeEnum];
