export const EnumSort = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const;
export type EnumSort = (typeof EnumSort)[keyof typeof EnumSort];
