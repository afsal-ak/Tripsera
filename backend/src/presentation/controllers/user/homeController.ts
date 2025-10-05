import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IHomeUseCases } from '@application/useCaseInterfaces/user/IHomeUseCases';

export class HomeController {
  constructor(private _homeUseCases: IHomeUseCases) { }

  getHome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._homeUseCases.getHome();

      res.status(HttpStatus.OK).json({ result });
    } catch (error) {
      next(error)
    }
  };

  getActivePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, sort, search, ...restFilters } = req.query;
      console.log('Query received:', req.query);

      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 9;
      const sortBy = (sort as string) || 'newest';
      const searchQuery = (search as string) || '';

      const rawFilters = restFilters;
      const filters: Record<string, string> = {};
      for (const [key, value] of Object.entries(rawFilters)) {
        if (value && typeof value === 'string' && value.trim() !== '') {
          filters[key] = value.trim();
        }
      }

      const result = await this._homeUseCases.getActivePackage({
        filters,
        page: pageNum,
        limit: limitNum,
        sort: sortBy,
        search: searchQuery,
      });

      res.status(HttpStatus.OK).json({
        message: 'Active packages fetched successfully',
        ...result,
      });
    } catch (error) {
      next(error)
    }
  };

  getPackagesById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const packages = await this._homeUseCases.getPackageById(id);
       res.status(HttpStatus.OK).json({ message: 'Package fetched successfully', packages });
    } catch (error) {
      next(error)
    }
  };
}
