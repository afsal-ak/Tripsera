import { CreateCompanyDTO, CompanyResponseDTO, UpdateCompanyDTO, CompanyFullResponseDTO } from "@application/dtos/CompanyDTO"

export interface ICompanyUseCases {
   getSetupData(userId: string): Promise<{
    name?: string
    email?: string
    phone?: number
    isGoogleUser?: boolean
  }>
  setupCompany(userId: string, data: CreateCompanyDTO): Promise<CompanyResponseDTO>
  //   updateCompany(
  //   userId: string,
  //   data: UpdateCompanyDTO
  // ): Promise<CompanyResponseDTO>;
updateCompany(
  userId: string,
  data: UpdateCompanyDTO
): Promise<CompanyFullResponseDTO>;

updateCompanyLogo(
  userId: string,
  logo: { url: string; public_id: string }
): Promise<CompanyResponseDTO>;

  getCompanyProfile(userId: string): Promise<CompanyFullResponseDTO>  

}