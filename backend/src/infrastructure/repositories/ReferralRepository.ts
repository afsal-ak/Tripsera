import { IReferral } from '@domain/entities/IReferral';
import { BaseRepository } from './BaseRepository';
import { IReferralRepository } from '@domain/repositories/IReferralRepository';
import { referralModel } from '@infrastructure/models/Referral';
import { UpdateReferralDTO } from '@application/dtos/ReferralDTO';

export class ReferralRepository extends BaseRepository<IReferral> implements IReferralRepository {
  constructor() {
    super(referralModel);
  }

  async getReferral(): Promise<IReferral | null> {
    return await referralModel.findOne().lean();
  }

  async upsertReferral(data: UpdateReferralDTO): Promise<IReferral> {
    return await referralModel.findOneAndUpdate(
      {},
      { $set: { ...data } },
      { upsert: true, new: true }
    );
  }
  async toggleBlockStatus(id: string, isBlocked: boolean): Promise<IReferral | null> {
    return await referralModel.findByIdAndUpdate(id, { isBlocked }, { new: true }).lean();
  }
}
