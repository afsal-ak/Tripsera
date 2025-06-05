import { ICategory } from "@domain/entities/ICategory";
import { ICategoryRepository } from "@domain/repositories/ICategoryRepository";


export class CategoryUseCases{
    constructor(
        private categoryRepo:ICategoryRepository
    ){}

    async getAllCategory():Promise<ICategory[]>{
        return this.categoryRepo.getAllCategories()
    }

    async createCategory(category:ICategory):Promise<ICategory>{
        return this.categoryRepo.createCategory(category)
    }

    async editCategory(id:string,categoryData:Partial<ICategory>):Promise<ICategory>{
         return this.categoryRepo.editCategory(id,categoryData)
    }

    async blockCategory(id:string):Promise<void>{
         await this.categoryRepo.blockCategory(id)
    }

    async unblockCategory(id:string):Promise<void>{
        await this.categoryRepo.unblockCategory(id)
    }
}