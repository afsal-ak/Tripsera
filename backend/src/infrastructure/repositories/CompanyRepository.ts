import { ICompany } from "@domain/entities/ICompany"
import { ICompanyRepository } from "@domain/repositories/ICompanyRepository"
import { CompanyModel } from "@infrastructure/models/Company"

export class CompanyRepository implements ICompanyRepository {

  async createCompany(data: Partial<ICompany>): Promise<ICompany> {
    const company = await CompanyModel.create(data)
    return company
  }

  async findByOwner(ownerId: string): Promise<ICompany | null> {
    return CompanyModel.findOne({ ownerId }).lean()
  }

  async updateCompany(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany | null> {

    return CompanyModel.findByIdAndUpdate(
      companyId,
      data,
      { new: true }
    ).lean();
  }

}