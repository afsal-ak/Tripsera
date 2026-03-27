import { CompanyFullResponseDTO } from "@application/dtos/CompanyDTO"
import { ICompany } from "@domain/entities/ICompany"
 
export const mapCompanyToDTO = (
  company: ICompany
): CompanyFullResponseDTO => {

  return {
    id: company._id!.toString(),

    name: company.name,
    email: company.email,
    phone: company.phone,

    ownerId: company.ownerId.toString(),

    description: company.description,
    website: company.website,

    logo: company.logo,

    address: company.address,

    gstNumber: company.gstNumber,
    licenseNumber: company.licenseNumber,

    documents: company.documents,

    rating: company.rating,
    totalReviews: company.totalReviews,

    isApproved: company.isApproved,
    isBlocked: company.isBlocked,
    isSetupComplete: company.isSetupComplete,

    createdAt: company.createdAt,
    updatedAt: company.updatedAt
  }
}