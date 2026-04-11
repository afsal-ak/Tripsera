import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { ICompanyUseCases } from "@application/useCaseInterfaces/admin/ICompanyUseCases";

export class CompanyController {
  constructor(
    private _companyUseCases: ICompanyUseCases,
  ) { }

  getCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, isApproved, isBlocked, page, limit } = req.query;

      const result = await this._companyUseCases.getAllCompany({
        search: search as string,
        isApproved:
          isApproved !== undefined ? isApproved === "true" : undefined,
        isBlocked:
          isBlocked !== undefined ? isBlocked === "true" : undefined,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error)

    }

  }

  approveCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;

      const company =
        await this._companyUseCases.approveCompany(companyId);

      res.status(HttpStatus.OK).json({
        message: "Company approved successfully",
        company,
      });
    } catch (error) {
      next(error)

    }

  }


  findByID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;

      const company =
        await this._companyUseCases.findById(companyId);

      res.status(HttpStatus.OK).json({
        message: "Company Fetched successfully",
        company,
      });
    } catch (error) {
      next(error)

    }

  }

  blockCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;

      const company =
        await this._companyUseCases.blockCompany(companyId);

      res.status(HttpStatus.OK).json({
        message: "Company blocked successfully",
        company,
      });
    } catch (error) {
      next(error)

    }

  }

  unblockCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.params;

      const company =
        await this._companyUseCases.unblockCompany(companyId);

      res.status(HttpStatus.OK).json({
        message: "Company unblocked successfully",
        company,
      });
    } catch (error) {
      next(error)
    }

  }
}