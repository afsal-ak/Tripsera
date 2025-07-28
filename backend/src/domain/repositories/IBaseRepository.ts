export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
   findAll(
    page?: number,
    limit?: number,
    filter?: Record<string, any>,
    sort?: 'newest' | 'oldest'
  ): Promise<{ data: T[]; total: number; page: number; totalPages: number }>;
  delete(id: string): Promise<void>;
 }

 
