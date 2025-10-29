import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IHomeUseCases } from '@application/useCaseInterfaces/user/IHomeUseCases';
import { IPackageFilter } from '@domain/entities/IPackageFilter';

export class HomeController {
  constructor(private _homeUseCases: IHomeUseCases) { }

  getHome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._homeUseCases.getHome();

      res.status(HttpStatus.OK).json({ result });
    } catch (error) {
      next(error);
    }
  };

  
  getActivePackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 9;

      const filters: IPackageFilter = {
        search: (req.query.search as string) || '',
        sort: (req.query.sort as string) as IPackageFilter['sort'] || 'newest',
        category: (req.query.category as string) || '',
        duration: req.query.duration ? parseInt(req.query.duration as string, 10) : undefined,
        startDate: (req.query.startDate as string) || '',
        endDate: (req.query.endDate as string) || '',
      };

      const data = await this._homeUseCases.getActivePackage(
        page,
        limit,
        filters

      );

      res.status(HttpStatus.OK).json({
        message: 'Active packages fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getPackagesById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const packages = await this._homeUseCases.getPackageById(id);
      res.status(HttpStatus.OK).json({ message: 'Package fetched successfully', packages });
    } catch (error) {
      next(error);
    }
  };
}
