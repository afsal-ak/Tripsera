import { ICategory } from '@domain/entities/ICategory';
import { PaginatedResult } from '@domain/entities/IPaginatedResult';
import { IFilter } from '@domain/entities/IFilter';
 import { CreateCategoryDTO,UpdateCategoryDTO,CategoryResponseDTO } from '@application/dtos/CategoryDTO';

export interface ICategoryUseCases {
  getAllCategory(params: { page: number; limit: number },filter:IFilter): Promise<PaginatedResult<CategoryResponseDTO>>;

  getActiveCategory(): Promise<CategoryResponseDTO[]>;

  createCategory(category: CreateCategoryDTO): Promise<CategoryResponseDTO>;

  findById(id: string): Promise<CategoryResponseDTO | null>;

  editCategory(id: string, categoryData: UpdateCategoryDTO): Promise<CategoryResponseDTO>;

  blockCategory(id: string): Promise<void>;

  unblockCategory(id: string): Promise<void>;
}
