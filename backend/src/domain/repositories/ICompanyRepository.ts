import { ICompany } from "@domain/entities/ICompany"

export interface ICompanyRepository {

  createCompany(data: Partial<ICompany>): Promise<ICompany>

  findByOwner(ownerId: string): Promise<ICompany | null>
   updateCompany(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany | null> 
}