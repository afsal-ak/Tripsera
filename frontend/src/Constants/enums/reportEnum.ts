export const EnumReportedType = {
  BLOG: 'blog',
  REVIEW: 'review',
  USER: 'user',
} as const;
export type EnumReportedType = (typeof EnumReportedType)[keyof typeof EnumReportedType];

// ✅ Report Status
export const EnumReportStatus = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
} as const;
export type EnumReportStatus = (typeof EnumReportStatus)[keyof typeof EnumReportStatus];

// ✅ Admin Action
export const EnumAdminAction = {
  WARN: 'warn',
  BLOCK: 'block',
  DELETE: 'delete',
  NONE: 'none',
} as const;
export type EnumAdminAction = (typeof EnumAdminAction)[keyof typeof EnumAdminAction];

// ✅ Report Block Status
export const EnumReportBlockStatus = {
  BLOCK: 'block',
  ACTIVE: 'active',
} as const;
export type EnumReportBlockStatus = (typeof EnumReportBlockStatus)[keyof typeof EnumReportBlockStatus];
