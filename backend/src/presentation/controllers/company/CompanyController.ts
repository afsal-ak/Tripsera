import { Request, Response, NextFunction } from 'express';


import { ICompanyUseCases } from "@application/useCaseInterfaces/company/ICompanyUseCases"
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest"
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';

export class CompanyController {

  constructor(
    private _companyUseCases: ICompanyUseCases
  ) { }
  getSetupData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const userId = getUserIdFromRequest(req)

      const data = await this._companyUseCases.getSetupData(userId)

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      })

    } catch (error) {
      next(error)
    }
  }

  setupCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {
      const data = req.body
      console.log(data, 'data from copmany setup')
      const userId = getUserIdFromRequest(req)
      const imagePath = req.file?.path

      if (imagePath) {
        const { url, public_id } = await uploadCloudinary(imagePath, 'companies')

        data.logo = { url, public_id }
      }
      const company = await this._companyUseCases.setupCompany(
        userId,
        data
      )

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Company setup completed",
        data: company
      })

    } catch (error) {
      next(error)
    }
  }
  
  updateCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const userId = getUserIdFromRequest(req);
      const data = req.body;

      const company = await this._companyUseCases.updateCompany(
        userId,
        data
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Company updated successfully",
        data: company
      });

    } catch (error) {
      next(error);
    }
  };


  updateCompanyLogo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const userId = getUserIdFromRequest(req);

      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "No image uploaded"
        });
        return;
      }

      const { url, public_id } = await uploadCloudinary(
        req.file.path,
        "companies"
      );

      const company = await this._companyUseCases.updateCompanyLogo(
        userId,
        { url, public_id }
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Logo updated successfully",
        data: company
      });

    } catch (error) {
      next(error);
    }
  };


  getCompanyProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const userId = getUserIdFromRequest(req)
      const data = req.body

      const company = await this._companyUseCases.getCompanyProfile(
        userId,
      )

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Company data fetched successfully',
        data: company
      })

    } catch (error) {
      next(error)
    }
  }
}