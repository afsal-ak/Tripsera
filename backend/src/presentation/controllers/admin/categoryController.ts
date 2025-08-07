import { Request, Response } from 'express';
import { ICategoryUseCases } from '@application/useCaseInterfaces/admin/ICategoryUseCases';
export class CategoryController {
  constructor(private categoryUseCase: ICategoryUseCases) {}

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = req.body;
      const created = await this.categoryUseCase.createCategory(category);
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
      const updated = await this.categoryUseCase.editCategory(id, categoryData);
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  blockCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.categoryUseCase.blockCategory(id);
      console.log(id, 'catid');
      res.status(200).json({ message: 'Category blocked successfully' });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  unblockCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.categoryUseCase.unblockCategory(id);
      res.status(200).json({ message: 'Category unblocked successfully' });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;

      const result = await this.categoryUseCase.getAllCategory({ page, limit });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getActiveCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.categoryUseCase.getActiveCategory();
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const categories = await this.categoryUseCase.findById(id);
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
