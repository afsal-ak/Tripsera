import { ICategory } from '@domain/entities/ICategory';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';

export interface ICategoryRepository {
  createCategory(category: ICategory): Promise<ICategory>;
  findById(id: string): Promise<ICategory | null>;
  editCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory>;
  getAllCategories(
    skip: number,
    limit: number,
    filters: IFilter
  ): Promise<{ data: ICategory[]; pagination: PaginationInfo }>;
  getActiveCategory(): Promise<ICategory[]>;
  blockCategory(id: string): Promise<void>;
  unblockCategory(id: string): Promise<void>;
}
