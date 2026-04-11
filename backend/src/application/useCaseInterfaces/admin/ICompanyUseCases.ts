import { CompanyFullResponseDTO, ICompanyFilterDTO, ICompanyListResponseDTO } from "@application/dtos/CompanyDTO";
import { ICompany } from "@domain/entities/ICompany";

export interface ICompanyUseCases {
    findById(companyId: string): Promise<CompanyFullResponseDTO | null>

    getAllCompany(filter: ICompanyFilterDTO): Promise<ICompanyListResponseDTO>
    approveCompany(companyId: string): Promise<CompanyFullResponseDTO | null>
    blockCompany(companyId: string): Promise<CompanyFullResponseDTO | null>
    unblockCompany(companyId: string): Promise<CompanyFullResponseDTO | null>

}