import { Request,Response } from "express";
import { BannerMangementUseCases } from "@domain/usecases/admin/bannerUseCases";
import { uploadCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService";
import { MongoBannerRepository } from "@infrastructure/repositories/MongoBannerRepository";

// const bannerRepository=new MongoBannerRepository()
// const bannerMangementUseCases=new BannerMangementUseCases(bannerRepository)

export class BannerMangementController {
  constructor(private bannerMangementUseCases: BannerMangementUseCases) {}

   createBanner=async (req:Request,res:Response)=>{
    try {
        const {title,description}=req.body
        const imagePath=req.file?.path

        if(!imagePath){
              res.status(400).json({ message: 'No file uploaded' }); 
              return
        }

        const imageUrl=await uploadCloudinary(imagePath)
        const banner=await this.bannerMangementUseCases.createNewBanner(title,description,imageUrl)
         res.status(201).json({message:'Banner Created Successfully',banner});


    } catch (error:any) {
        console.error(error);
            res.status(500).json({ message: error.message || "Something went wrong" });
    }
}

    getBanner=async (req:Request,res:Response):Promise<void>=>{
        try {
            const banners=await this.bannerMangementUseCases.getBanners()
            res.status(200).json({message:'Banner fetched successfully',banners})
        } catch (error:any) {
            res.status(500).json({ message: error.message || "Something went wrong" });

        }
    }

    deleteBanner=async(req:Request,res:Response):Promise<void>=>{
        try {
            const {bannerId}=req.params
            await this.bannerMangementUseCases.deleteBanner(bannerId)
          res.status(200).json({message:'Banner deleted successfully'})

        } catch (error:any) {
            res.status(500).json({ message: error.message || "Something went wrong" });

        }
    }

}
// export default{
//     createBanner
// }