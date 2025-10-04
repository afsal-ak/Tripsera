import { ICategory } from '@domain/entities/ICategory';
import { IFilter } from '@domain/entities/IFilter';
import { IPaginatedResult } from '@domain/entities/IPagination';
export interface ICategoryRepository {
  createCategory(category: ICategory): Promise<ICategory>;
  findById(id: string): Promise<ICategory | null>;
  editCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory>;
  getAllCategories(page: number, limit: number,filters:IFilter): Promise<IPaginatedResult<ICategory>>;
  getActiveCategory(): Promise<ICategory[]>;
  blockCategory(id: string): Promise<void>;
  unblockCategory(id: string): Promise<void>;
}
