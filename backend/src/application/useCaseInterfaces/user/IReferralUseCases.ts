 import { ReferralResponseDTO } from '@application/dtos/ReferralDTO';

export interface IReferralUseCases {
  getReferral(): Promise<ReferralResponseDTO | null>;
}
