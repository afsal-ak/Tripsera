// src/presentation/controllers/CategoryController.ts
import { Request, Response } from "express";
import { CategoryUseCases } from "@domain/usecases/admin/categoryUseCases";

export class CategoryController {
  constructor(private categoryUseCase: CategoryUseCases) {}

  async createCategory(req: Request, res: Response) {
    try {
      const category = req.body;
      const created = await this.categoryUseCase.createCategory(category);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async editCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      const updated = await this.categoryUseCase.editCategory(id, categoryData);
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async blockCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.categoryUseCase.blockCategory(id);
      res.status(200).json({ message: "Category blocked successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async unblockCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.categoryUseCase.unblockCategory(id);
      res.status(200).json({ message: "Category unblocked successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await this.categoryUseCase.getAllCategory();
      res.status(200).json(categories);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
