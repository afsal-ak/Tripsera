import { CompanyFullResponseDTO, ICompanyFilterDTO, ICompanyListResponseDTO } from "@application/dtos/CompanyDTO";
import { mapCompanyToDTO } from "@application/mappers/CompanyMapper";
import { ICompanyUseCases } from "@application/useCaseInterfaces/admin/ICompanyUseCases";
import { ICompany } from "@domain/entities/ICompany";
import { ICompanyRepository } from "@domain/repositories/ICompanyRepository";

export class CompanyUseCases implements ICompanyUseCases {
  constructor(private _companyRepo: ICompanyRepository) { }

  // async getAllCompany(filter: ICompanyFilterDTO): Promise<ICompanyListResponseDTO> {
  //   const { companies, total } =
  //     await this._companyRepo.findAllWithFilter(filter);

  //   const page = filter.page || 1;
  //   const limit = filter.limit || 10;

  //   return {
  //     companies,
  //     total,
  //     page,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async getAllCompany(filter: ICompanyFilterDTO): Promise<ICompanyListResponseDTO> {
    const { companies, total } =
      await this._companyRepo.findAllWithFilter(filter);
console.log(companies,total,'company');

    const page = filter.page || 1;
    const limit = filter.limit || 10;

    return {
      companies: companies.map(mapCompanyToDTO), // ✅ FIX
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(companyId: string): Promise<CompanyFullResponseDTO | null> {


    const company = await this._companyRepo.findById(companyId)
    return company ? mapCompanyToDTO(company) : null; //  FIX

  }

  async approveCompany(companyId: string): Promise<CompanyFullResponseDTO | null> {
    const company = await this._companyRepo.updateStatus(companyId, {
      isApproved: true,
    });
    return company ? mapCompanyToDTO(company) : null; //  FIX

  }

  async blockCompany(companyId: string): Promise<CompanyFullResponseDTO | null> {
    const company = await this._companyRepo.updateStatus(companyId, {
      isBlocked: true,
    });
    return company ? mapCompanyToDTO(company) : null; //  FIX

  }

  async unblockCompany(companyId: string): Promise<CompanyFullResponseDTO | null> {
    const company = await this._companyRepo.updateStatus(companyId, {
      isBlocked: false,
    });
    return company ? mapCompanyToDTO(company) : null; //  FIX

  }

}