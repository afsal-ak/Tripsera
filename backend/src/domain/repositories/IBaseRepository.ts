import { PaginationInfo } from "@application/dtos/PaginationDto";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(
    page?: number,
    limit?: number,
    filter?: Record<string, any>,
    sort?: 'newest' | 'oldest'
  ): Promise<{ data: T[]; pagination:PaginationInfo }>;

  update(id: string, data: Partial<T>): Promise<T | null>;

  delete(id: string): Promise<boolean>;
}


