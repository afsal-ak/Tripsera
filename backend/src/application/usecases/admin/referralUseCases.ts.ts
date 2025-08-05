import { IReferral } from "@domain/entities/IReferral";
import { IReferralUseCases } from "@application/useCaseInterfaces/admin/IReferralUserCases";
import { IReferralRepository } from "@domain/repositories/IReferralRepository";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { CreateReferralDTO, UpdateReferralDTO } from "@application/dtos/ReferralDto";

export class ReferralUseCase implements IReferralUseCases {
    constructor(private referralRepo: IReferralRepository) { }
    async upsertReferral(data: UpdateReferralDTO): Promise<IReferral> {
        return await this.referralRepo.upsertReferral(data);
    }

    async getReferral(): Promise<IReferral|null> {
        return await this.referralRepo.getReferral()

    }
    async getReferralById(referralId: string): Promise<IReferral | null> {
        return await this.referralRepo.findById(referralId)
    }
    async changeReferralStatus(referralId: string, isBlocked: boolean): Promise<IReferral | null> {
        return await this.referralRepo.update(referralId, { isBlocked })
    }

    async deleteReferral(referralId: string): Promise<boolean> {
        return await this.referralRepo.delete(referralId)
    }
}