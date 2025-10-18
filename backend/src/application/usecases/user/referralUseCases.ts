import { ReferralResponseDTO } from '@application/dtos/ReferralDTO';
import { ReferralMapper } from '@application/mappers/ReferralMapper';
import { IReferralUseCases } from '@application/useCaseInterfaces/user/IReferralUseCases';
import { IReferralRepository } from '@domain/repositories/IReferralRepository';

export class ReferralUseCase implements IReferralUseCases {
  constructor(private _referralRepo: IReferralRepository) {}

  async getReferral(): Promise<ReferralResponseDTO | null> {
    const referral= await this._referralRepo.getReferral();
    return referral?ReferralMapper.toResponseDTO(referral):null
  }
}
