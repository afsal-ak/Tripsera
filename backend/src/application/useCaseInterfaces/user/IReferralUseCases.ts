 import { ReferralResponseDTO } from '@application/dtos/ReferralDto';

export interface IReferralUseCases {
  getReferral(): Promise<ReferralResponseDTO | null>;
}
