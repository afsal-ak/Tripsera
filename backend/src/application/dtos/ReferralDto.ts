import { IReferral } from '@domain/entities/IReferral';
export interface CreateReferralDTO {
  amount: number;
}

export interface UpdateReferralDTO {
  _id: string;
  amount: number;
  isBlocked?: boolean;
}

export interface ReferralResponseDTO {
  _id: string;
  amount: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toReferralResponseDTO = (referral: IReferral): ReferralResponseDTO => {
  return {
    _id: referral._id!.toString(),
    amount: referral.amount,
    isBlocked: referral.isBlocked ?? false,
    createdAt: referral.createdAt!,
    updatedAt: referral.updatedAt!,
  };
};
