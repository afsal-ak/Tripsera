import { IReferralUseCases } from "@application/useCaseInterfaces/user/IReferralUseCases";
import { IReferral } from "@domain/entities/IReferral";
import { IReferralRepository } from "@domain/repositories/IReferralRepository";

export class ReferralUseCase implements IReferralUseCases{
    constructor(private referralRepo:IReferralRepository){}

    async getReferral(): Promise<IReferral | null> {
        return await this.referralRepo.getReferral()
    }
}