import { NextFunction, Request, Response } from 'express';
import { ICategoryUseCases } from '@application/useCaseInterfaces/admin/ICategoryUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { CreateCategoryDTO, UpdateCategoryDTO } from '@application/dtos/CategoryDTO';
import { CategoryMessages } from '@constants/messages/admin/CategoryMessages';

export class CategoryController {
  constructor(private _categoryUseCase: ICategoryUseCases) { }

  getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;

      const filters: IFilter = {
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
      };
      const result = await this._categoryUseCase.getAllCategory({ page, limit }, filters);
     console.log(result,'category');
     
      res.status(HttpStatus.OK).json({
        message: CategoryMessages.CATEGORIES_FETCHED,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category: CreateCategoryDTO = req.body;
      const created = await this._categoryUseCase.createCategory(category);
      res.status(HttpStatus.CREATED).json({
        message: CategoryMessages.CATEGORY_CREATED,
        data: created
      });
    } catch (error) {
      next(error);
    }
  };

  editCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const categoryData: UpdateCategoryDTO = req.body;
      const updated = await this._categoryUseCase.editCategory(id, categoryData);
      res.status(HttpStatus.OK).json({ message: CategoryMessages.CATEGORY_UPDATED, data: updated });
    } catch (error) {
      next(error);
    }
  };

  blockCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._categoryUseCase.blockCategory(id);
      res.status(HttpStatus.OK).json({ message: CategoryMessages.CATEGORY_BLOCKED });
    } catch (error) {
      next(error);
    }
  };

  unblockCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._categoryUseCase.unblockCategory(id);
      res.status(HttpStatus.OK).json({ message: CategoryMessages.CATEGORY_UNBLOCKED });
    } catch (error) {
      next(error);
    }
  };

  getActiveCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._categoryUseCase.getActiveCategory();
          console.log(result,'category');

      res.status(HttpStatus.OK).json({
        message: CategoryMessages.ACTIVE_CATEGORIES_FETCHED,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const categories = await this._categoryUseCase.findById(id);
         console.log(categories,'category');

      res.status(HttpStatus.OK).json({
        message: CategoryMessages.CATEGORY_FETCHED,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  };
}
