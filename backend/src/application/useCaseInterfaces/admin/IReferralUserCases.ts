import { UpdateReferralDTO,ReferralResponseDTO } from '@application/dtos/ReferralDTO';

export interface IReferralUseCases {
  upsertReferral(data: UpdateReferralDTO): Promise<ReferralResponseDTO>;

  getReferral(): Promise<ReferralResponseDTO | null>;
  changeReferralStatus(id: string, isBlocked: boolean): Promise<ReferralResponseDTO | null>;
  deleteReferral(id: string): Promise<boolean>;
  getReferralById(id: string): Promise<ReferralResponseDTO | null>;
}
