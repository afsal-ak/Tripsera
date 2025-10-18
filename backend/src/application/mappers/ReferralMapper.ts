 import { IReferral } from '@domain/entities/IReferral';
import { ReferralResponseDTO } from '@application/dtos/ReferralDto';

export abstract class ReferralMapper {
  static toResponseDTO(referral: IReferral): ReferralResponseDTO {
    return {
      _id: referral._id!.toString(),
      amount: referral.amount,
      isBlocked: !!referral.isBlocked,
     
    };
  }
}
