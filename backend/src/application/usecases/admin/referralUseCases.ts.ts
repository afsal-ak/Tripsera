 import { IReferralUseCases } from '@application/useCaseInterfaces/admin/IReferralUserCases';
import { IReferralRepository } from '@domain/repositories/IReferralRepository';
import { UpdateReferralDTO, ReferralResponseDTO } from '@application/dtos/ReferralDTO';
import { ReferralMapper } from '@application/mappers/ReferralMapper';

export class ReferralUseCase implements IReferralUseCases {

  constructor(private _referralRepo: IReferralRepository) {}


  async upsertReferral(data: UpdateReferralDTO): Promise<ReferralResponseDTO> {
    const referral = await this._referralRepo.upsertReferral(data);
    return ReferralMapper.toResponseDTO(referral)
  }

  async getReferral(): Promise<ReferralResponseDTO | null> {
    const referral = await this._referralRepo.getReferral();
    return referral ? ReferralMapper.toResponseDTO(referral) : null

  }
  async getReferralById(referralId: string): Promise<ReferralResponseDTO | null> {
    const referral = await this._referralRepo.findById(referralId);
    return referral ? ReferralMapper.toResponseDTO(referral) : null

  }
  async changeReferralStatus(referralId: string, isBlocked: boolean): Promise<ReferralResponseDTO | null> {
    const referral = await this._referralRepo.update(referralId, { isBlocked });
    return referral ? ReferralMapper.toResponseDTO(referral) : null

  }

  async deleteReferral(referralId: string): Promise<boolean> {
    return await this._referralRepo.delete(referralId);
  }
}
