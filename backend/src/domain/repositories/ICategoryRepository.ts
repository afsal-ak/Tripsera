import { ICategory } from "@domain/entities/ICategory";

export interface ICategoryRepository{
    createCategory(category:ICategory):Promise<ICategory>
    editCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory>;
    getAllCategories(): Promise<ICategory[]>;
    blockCategory(id:string):Promise<void>
    unblockCategory(id:string):Promise<void>
}