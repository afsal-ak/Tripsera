import { IReferral } from '@domain/entities/IReferral';

export interface IReferralUseCases {
  getReferral(): Promise<IReferral | null>;
}
