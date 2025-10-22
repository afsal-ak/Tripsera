// export enum EnumBlogStatus {
//   DRAFT = 'draft',
//   PUBLISHED = 'published',
//   ARCHIVED = 'archived',
// }
//  Blog Status
export const EnumBlogStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
export type EnumBlogStatus = (typeof EnumBlogStatus)[keyof typeof EnumBlogStatus];
