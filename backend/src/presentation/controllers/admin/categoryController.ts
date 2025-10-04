import { Request, Response } from 'express';
import { ICategoryUseCases } from '@application/useCaseInterfaces/admin/ICategoryUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
export class CategoryController {

  constructor(private _categoryUseCase: ICategoryUseCases) { }

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      
      const filters: IFilter = {
        search: (req.query.search as string) || "",
        status: (req.query.status as string) || "",

      };
      const result = await this._categoryUseCase.getAllCategory({ page, limit },filters);
      res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = req.body;
      const created = await this._categoryUseCase.createCategory(category);
      console.log(created, 'creat');
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  editCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      const updated = await this._categoryUseCase.editCategory(id, categoryData);
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  blockCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this._categoryUseCase.blockCategory(id);
      console.log(id, 'catid');
      res.status(200).json({ message: 'Category blocked successfully' });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  unblockCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this._categoryUseCase.unblockCategory(id);
      res.status(200).json({ message: 'Category unblocked successfully' });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };



  getActiveCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this._categoryUseCase.getActiveCategory();
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const categories = await this._categoryUseCase.findById(id);
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
