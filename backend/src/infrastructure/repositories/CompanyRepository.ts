import { ICompanyFilterDTO } from "@application/dtos/CompanyDTO"
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

  async findAllWithFilter(filter: ICompanyFilterDTO): Promise<{ companies: ICompany[]; total: number }> {


    // async findAllWithFilter(filter: ICompanyFilterDTO):Promise<> {
    const {
      search,
      isApproved,
      isBlocked,
      page = 1,
      limit = 10,
    } = filter;

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (isApproved !== undefined) {
      query.isApproved = isApproved;
    }

    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked;
    }

    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      CompanyModel.find(query)
        .populate("ownerId", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.countDocuments(query),
    ]);

    return { companies, total };
  }

  async updateStatus(companyId: string, data: Partial<ICompany>): Promise<ICompany | null> {
    return await CompanyModel.findByIdAndUpdate(companyId, data, {
      new: true,
    });
  }

  // async findById(companyId: string): Promise<ICompany | null>{
  //   return await CompanyModel.findById(companyId);
  // }
  async findById(companyId: string): Promise<ICompany | null> {

    return await CompanyModel.findById(companyId)
      .populate("ownerId", "username email phone");
  }
}