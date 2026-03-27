import { CompanyFullResponseDTO, CompanyResponseDTO, CreateCompanyDTO, UpdateCompanyDTO } from "@application/dtos/CompanyDTO"
import { mapCompanyToDTO } from "@application/mappers/CompanyMapper"
import { ICompanyUseCases } from "@application/useCaseInterfaces/company/ICompanyUseCases"
import { HttpStatus } from "@constants/HttpStatus/HttpStatus"
import { ICompanyRepository } from "@domain/repositories/ICompanyRepository"
import { IUserRepository } from "@domain/repositories/IUserRepository"
import { deleteImageFromCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService"
import { AppError } from "@shared/utils/AppError"



export class CompanyUseCases implements ICompanyUseCases {
  constructor(
    private _companyRepository: ICompanyRepository,
    private _userRepository: IUserRepository
  ) { }

  async getSetupData(userId: string) {

    const user = await this._userRepository.findById(userId)

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, "User not found")
    }

    return {
      name: user.fullName || user.username,
      email: user.email,
      phone: user.phone,
      isGoogleUser: user.isGoogleUser
    }
  }

  async setupCompany(
    userId: string,
    data: CreateCompanyDTO
  ): Promise<CompanyResponseDTO> {

    const user = await this._userRepository.findById(userId)

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, "User not found")
    }

    const existingCompany = await this._companyRepository.findByOwner(userId)

    if (existingCompany) {
      throw new AppError(HttpStatus.CONFLICT, "Company already exists")
    }

    // update user fields if changed
    await this._userRepository.updateUser(userId, {
      email: data.email,
      phone: data.phone,
      fullName: data.name,
      isSetupComplete: true

    })

    const company = await this._companyRepository.createCompany({
      ...data,
      ownerId: userId,
      isSetupComplete: true
    })

    await this._userRepository.updateCompanyId(userId, company._id!.toString())

    return {
      id: company._id!.toString(),
      name: company.name,
      email: company.email,
      phone: company.phone,
      isSetupComplete:company.isSetupComplete,
      ownerId: company.ownerId.toString()
    }
  }



  async updateCompany(
    userId: string,
    data: UpdateCompanyDTO
  ): Promise<CompanyFullResponseDTO> {

    const company = await this._companyRepository.findByOwner(userId);

    if (!company) {
      throw new AppError(HttpStatus.NOT_FOUND, "Company not found");
    }

    /* Update user if important fields changed */

    const userUpdate: any = {};

    if (data.name) userUpdate.fullName = data.name;
    if (data.email) userUpdate.email = data.email;
    if (data.phone) userUpdate.phone = data.phone;

    if (Object.keys(userUpdate).length > 0) {
      await this._userRepository.updateUser(userId, userUpdate);
    }

    const updatedCompany = await this._companyRepository.updateCompany(
      company._id!.toString(),
      data
    );

    return mapCompanyToDTO(updatedCompany!)
  }


  async updateCompanyLogo(
    userId: string,
    logo: { url: string; public_id: string }
  ): Promise<CompanyFullResponseDTO> {

    const company = await this._companyRepository.findByOwner(userId);

    if (!company) {
      throw new AppError(HttpStatus.NOT_FOUND, "Company not found");
    }

    /* delete old logo */

    if (company.logo?.public_id) {
      await deleteImageFromCloudinary(company.logo.public_id);
    }

    const updatedCompany = await this._companyRepository.updateCompany(
      company._id!.toString(),
      { logo }
    );

    return mapCompanyToDTO(updatedCompany!)

    // return updatedCompany;
  }


  async getCompanyProfile(userId: string): Promise<CompanyFullResponseDTO> {

    const company = await this._companyRepository.findByOwner(userId)

    if (!company) {
      throw new AppError(HttpStatus.NOT_FOUND, "Company not found")
    }

    return mapCompanyToDTO(company)
  }

}