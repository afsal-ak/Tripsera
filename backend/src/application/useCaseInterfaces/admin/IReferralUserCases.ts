import { IReferral } from "@domain/entities/IReferral";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { CreateReferralDTO, UpdateReferralDTO } from "@application/dtos/ReferralDto";

export interface IReferralUseCases {
    //    createReferral(data: CreateReferralDTO): Promise<IReferral>;
    //      editReferral(referralId:string,data: UpdateReferralDTO): Promise<IReferral|null>;
    upsertReferral(data: UpdateReferralDTO): Promise<IReferral>;

    getReferral(): Promise<IReferral|null>;
    changeReferralStatus(IReferral: string, isBlocked: boolean): Promise<IReferral | null>;
    deleteReferral(IReferral: string): Promise<boolean>;
    getReferralById(IReferral: string): Promise<IReferral | null>;

}
