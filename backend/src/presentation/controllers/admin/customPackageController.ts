import { Request, Response, NextFunction } from 'express';
import { ICustomPkgUseCases } from '@application/useCaseInterfaces/admin/ICustomPackageUseCases';
import { UpdateCustomPkgStatusDTO } from '@application/dtos/CustomPkgDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IFilter } from '@domain/entities/IFilter';

export class CustomPackageController {
  constructor(private readonly _customPkgUseCases: ICustomPkgUseCases) {}

  changeCustomPkgStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const pkgId = req.params.packageId;
      const data: UpdateCustomPkgStatusDTO = req.body;

      const pkg = await this._customPkgUseCases.changeCustomPkgStatus(pkgId, data);
 
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: pkg,
        message: 'Package updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getAllCustomPkgs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const filters: IFilter = {
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
        sort: (req.query.sort as string) || '',
        startDate: (req.query.startDate as string) || '',
        endDate: (req.query.endDate as string) || '',
      };
      const data = await this._customPkgUseCases.getAllCustomPkg(page, limit, filters);
      res.status(HttpStatus.OK).json({
        data,
        message: 'Package fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getCustomPkgById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pkgId = req.params.packageId;

      const pkg = await this._customPkgUseCases.getCustomPkgById(pkgId);
      res.status(HttpStatus.OK).json({
        data: pkg,
        message: 'Package fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCustomPkg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pkgId = req.params.packageId;
      const result = await this._customPkgUseCases.deleteCustomPkg(pkgId);
      res.status(HttpStatus.OK).json({
        result,
        message: 'Package deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
