import { IReferral } from '@domain/entities/IReferral';
import { UpdateReferralDTO,ReferralResponseDTO } from '@application/dtos/ReferralDTO';

export interface IReferralUseCases {
  upsertReferral(data: UpdateReferralDTO): Promise<IReferral>;

  getReferral(): Promise<ReferralResponseDTO | null>;
  changeReferralStatus(id: string, isBlocked: boolean): Promise<ReferralResponseDTO | null>;
  deleteReferral(id: string): Promise<boolean>;
  getReferralById(id: string): Promise<ReferralResponseDTO | null>;
}
