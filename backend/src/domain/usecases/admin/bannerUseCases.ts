import { IBannerRepository } from "@domain/repositories/IBannerRepository";
import { IBanner } from "@domain/entities/IBanner";


export class BannerMangementUseCases{
    constructor(
        private bannerRepository:IBannerRepository
    ){}

    // async createNewBanner(title:string,description:string,  image: { url: string; public_id: string }):Promise<IBanner>{
    //     return await this.bannerRepository.createBanner({title,description,image})
    // }
    // usecases/BannerManagementUseCases.ts
async createNewBanner(banner: IBanner): Promise<IBanner> {
  return await this.bannerRepository.createBanner(banner);
}

    async getBanners():Promise<IBanner[]>{
        return await this.bannerRepository.getAllBanners()
    }

    async deleteBanner(bannerId:string):Promise<void>{
        await this.bannerRepository.deleteBanner(bannerId)
    }
}
