import { Request, Response, NextFunction } from 'express';
import { ICustomPkgUseCases } from '@application/useCaseInterfaces/user/ICustomPackageUseCases';
import { CreateCustomPkgDTO, UpdateCustomPkgDTO } from '@application/dtos/CustomPkgDTO';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { AppError } from '@shared/utils/AppError';

export class CustomPackageController {
  constructor(private readonly _customPkgUseCases: ICustomPkgUseCases) { }

  createCustomPkg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const data: CreateCustomPkgDTO = {
        ...req.body,
        userId,
      };
      const result = await this._customPkgUseCases.createCutomPkg(data);
      console.log(result, 'custom pkg resposnse');

      switch (result.status) {
        case 'exact_match':
          res.status(HttpStatus.OK).json({
            success: true,
            ...result,
          });
          break;

        case 'similar_found':
          res.status(HttpStatus.OK).json({
            success: true,
            ...result,
          });
          break;

        case 'created':
          res.status(HttpStatus.CREATED).json({
            success: true,
            ...result,
          });
          break;

        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error',
          });
        }
       

      } catch (error) {
        next(error);
      }
    };

    updateCustomPkg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userId = getUserIdFromRequest(req);
        const pkgId = req.params.packageId;
        const data: UpdateCustomPkgDTO = req.body;

        const pkg = await this._customPkgUseCases.updateCutomPkg(pkgId, userId, data);
        if (!pkg) {
          throw new AppError(HttpStatus.NOT_FOUND, 'not found');
        }
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
        const userId = getUserIdFromRequest(req);

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const data = await this._customPkgUseCases.getAllCustomPkg(userId, page, limit);

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

        const data = await this._customPkgUseCases.getCustomPkgById(pkgId);
        res.status(HttpStatus.OK).json({
          data,
          message: 'Package fetched successfully',
        });
      } catch (error) {
        next(error);
      }
    };

    deleteCustomPkg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userId = getUserIdFromRequest(req);
        const pkgId = req.params.packageId;
        const result = await this._customPkgUseCases.deleteCustomPkg(pkgId, userId);
        res.status(HttpStatus.OK).json({
          result,
          message: 'Package deleted successfully',
        });
      } catch (error) {
        next(error);
      }
    };

    getCustomPackagesForUser = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userId = getUserIdFromRequest(req);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, pagination } = await this._customPkgUseCases.getCustomPackagesForUser(userId, page, limit);

        res.status(HttpStatus.OK).json({
          data,
          pagination,
          message: 'Custom packages sent successfully',
        });
      } catch (error) {
        next(error);
      }
    };


  }
