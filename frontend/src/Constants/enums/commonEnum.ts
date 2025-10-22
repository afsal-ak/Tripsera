export const EnumGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;
export type EnumGender = (typeof EnumGender)[keyof typeof EnumGender];
