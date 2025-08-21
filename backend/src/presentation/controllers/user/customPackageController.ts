import { Request, Response, NextFunction } from "express";
import { ICustomPkgUseCases } from "@application/useCaseInterfaces/user/ICustomPackageUseCases";
import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { CreateCustomPkgDTO, UpdateCustomPkgDTO, toCustomPkgResponseDTO } from "@application/dtos/CustomPkgDTO";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";


export class CustomPackageController {
    constructor(private readonly _customPkgUseCases: ICustomPkgUseCases) { }

    createCustomPkg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserIdFromRequest(req)

            const data: CreateCustomPkgDTO = {
                ...req.body,
                userId,
            };
            const pkg = await this._customPkgUseCases.createCutomPkg(data)
            console.log(data, 'data from pkg');

            res.status(HttpStatus.CREATED).json({
                success: true,
                data: toCustomPkgResponseDTO(pkg),
                message: 'Package created successfully',
            });
        } catch (error) {
            next(error)
        }
    }

    updateCustomPkg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserIdFromRequest(req)
            const  pkgId  = req.params.packageId
            const data: UpdateCustomPkgDTO =req.body
          
            const pkg = await this._customPkgUseCases.updateCutomPkg(pkgId, userId, data)
            console.log(data, 'data from pkg');
if(!pkg){
    throw new Error('not found')
}
            res.status(HttpStatus.CREATED).json({
                success: true,
                data: toCustomPkgResponseDTO(pkg),
                message: 'Package updated successfully',
            });
        } catch (error) {
            next(error)
        }
    }

    getAllCustomPkgs= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const userId = getUserIdFromRequest(req);
    
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 9;
          const { data, pagination } = await this._customPkgUseCases.getAllCustomPkg(userId, page, limit);
          
          res.status(HttpStatus.OK).json({
            data: data.map(toCustomPkgResponseDTO),
            pagination,
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
          console.log(data, 'data');
          const pkg=toCustomPkgResponseDTO(data!)
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
            console.log('from usecase')

      const userId = getUserIdFromRequest(req);
      console.log(userId,'id')
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

}