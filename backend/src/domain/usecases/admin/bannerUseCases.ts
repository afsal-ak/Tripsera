import { IBannerRepository } from "@domain/repositories/IBannerRepository";
import { IBanner } from "@domain/entities/IBanner";


export class BannerMangementUseCases{
    constructor(
        private bannerRepository:IBannerRepository
    ){}

    async createNewBanner(title:string,description:string,imageUrl:string):Promise<IBanner>{
        return await this.bannerRepository.createBanner({title,description,imageUrl})
    }

    async getBanners():Promise<IBanner[]>{
        return await this.bannerRepository.getAllBanners()
    }

    async deleteBanner(bannerId:string):Promise<void>{
        await this.bannerRepository.deleteBanner(bannerId)
    }
}
