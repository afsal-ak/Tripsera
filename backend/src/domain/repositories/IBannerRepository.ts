import { IBanner } from "@domain/entities/IBanner";

export interface IBannerRepository{
    createBanner(banner:IBanner):Promise<IBanner>
    getAllBanners():Promise<IBanner[]>
     deleteBanner(id:string):Promise<void>
}