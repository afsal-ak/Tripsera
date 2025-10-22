// export enum EnumParentType {
//   BLOG = 'blog',
//   REVIEW = 'review',
// }
export const EnumParentType = {
  BLOG: 'blog',
  REVIEW: 'review',
} as const;
export type EnumParentType = (typeof EnumParentType)[keyof typeof EnumParentType];
