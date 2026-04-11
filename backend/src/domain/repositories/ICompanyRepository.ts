import { ICompanyFilterDTO } from "@application/dtos/CompanyDTO";
import { ICompany } from "@domain/entities/ICompany"

export interface ICompanyRepository {
  findById(companyId: string): Promise<ICompany | null>;

  createCompany(data: Partial<ICompany>): Promise<ICompany>

  findByOwner(ownerId: string): Promise<ICompany | null>
  updateCompany(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany | null> 


   findAllWithFilter(
    filter: ICompanyFilterDTO
  ): Promise<{ companies: ICompany[]; total: number }>;

  updateStatus(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany | null>;

 
}