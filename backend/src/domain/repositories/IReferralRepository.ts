import { IBaseRepository } from "./IBaseRepository";
import { IReferral } from "@domain/entities/IReferral";
import { UpdateReferralDTO } from "@application/dtos/ReferralDto";
export interface IReferralRepository extends IBaseRepository<IReferral> {
     getReferral(): Promise<IReferral | null> 
    upsertReferral(data: UpdateReferralDTO): Promise<IReferral> 
    toggleBlockStatus(referralId:string,isBlocked:boolean):Promise<IReferral|null>

}