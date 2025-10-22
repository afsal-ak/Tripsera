export const EnumUserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type EnumUserRole = (typeof EnumUserRole)[keyof typeof EnumUserRole];

export const EnumGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export type EnumGender = (typeof EnumGender)[keyof typeof EnumGender];
