export const EnumCouponType = {
  PERCENTAGE: 'percentage',
  FLAT: 'flat',
} as const;
export type EnumCouponType = (typeof EnumCouponType)[keyof typeof EnumCouponType];
