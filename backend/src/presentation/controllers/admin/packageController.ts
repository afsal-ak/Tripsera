import { Request,Response } from "express";
import { PackageUseCases } from "@domain/usecases/admin/packageUseCases";
import { IPackage } from "@domain/entities/IPackage";
import cloudinary from "@infrastructure/services/cloudinary/cloudinary";
import { uploadCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService";

export class PackageController{
    constructor( private packageUseCase: PackageUseCases ){}

     getFullPackage=async(req:Request,res:Response):Promise<void>=>{
        try {
          const packages=await this.packageUseCase.getAllPackages()
          res.status(200).json({message:'Package fetched successfully',packages})

        } catch (error:any) {
           res.status(500).json({ message: error.message || "Something went wrong" });

        }
     }

      getPackagesById=async(req:Request,res:Response):Promise<void>=>{
        try {
            const {id}=req.params
          const packages=await this.packageUseCase.getSinglePackage(id)
          res.status(200).json({message:'Package fetched successfully',packages})

        } catch (error:any) {
           res.status(500).json({ message: error.message || "Something went wrong" });

        }
     }

   //   createPackage=async(req:Request,res:Response):Promise<void>=>{
   //      try {
   //          const pkg:IPackage=req.body
   //          const imagePath=req.files
   //          console.log(req.files)

   //          console.log(imagePath,'im')
   //         // console.log(req.body,'body')

   //            if(!imagePath){
   //            res.status(400).json({ message: 'No file uploaded' }); 
   //            return
   //      }
   //        //  const imageUrl=await uploadCloudinary(imagePath)
   //          // pkg.imageUrls = [imageUrl];

   //          const createdPkg=await this.packageUseCase.createPackage(pkg)
   //          res.status(200).json({message:"Package created succesfully",createdPkg})//need to check whether pkg pass int o frontend
   //      } catch (error:any) {
   //           res.status(500).json({ message: error.message || "Something went wrong" });
   //      }
   //   }

   // createPackage = async (req: Request, res: Response): Promise<void> => {
   //    try {
   //       const pkg: IPackage = {
   //          ...req.body,
   //          location: req.body.location ? JSON.parse(req.body.location) : [],
   //          //category: JSON.parse(req.body.category),
   //       }; const files = req.files as Express.Multer.File[];
   //       console.log(req.body, 'reqbody')
   //       if (!files || files.length === 0) {
   //          res.status(400).json({ message: 'No file uploaded' });
   //          return;
   //       }

   //       // Upload all images to Cloudinary (assuming uploadCloudinary returns URL)
   //       const imageUrls = await Promise.all(
   //          files.map((file) => uploadCloudinary(file.path, 'packages'))
   //       );

   //       // Add URLs to package
   //       pkg.imageUrls = imageUrls;

   //       const createdPkg = await this.packageUseCase.createPackage(pkg);
   //       res.status(200).json({ message: 'Package created successfully', createdPkg });
   //    } catch (error: any) {
   //       res.status(500).json({ message: error.message || 'Something went wrong' });
   //    }
   // };
createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const pkg: IPackage = {
      ...req.body,
      location: req.body.location ? JSON.parse(req.body.location) : [],
    };

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const imageUrls = await Promise.all(
      files.map(file => uploadCloudinary(file.path, 'packages'))
    );

    pkg.imageUrls = imageUrls; // Now contains both url & public_id

    const createdPkg = await this.packageUseCase.createPackage(pkg);
    res.status(200).json({ message: 'Package created successfully', createdPkg });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};

  //  editPackage = async (req: Request, res: Response): Promise<void> => {
  //     try {
  //        const {id}=req.params
  //        const pkgData:any=req.body
  //       const files=req.files as Express.Multer.File[]

  //       const deletedImages=pkgData.deletedImages?JSON.parse(pkgData.deletedImages):[]

  //       const newImages=files?.length
  //          ?await Promise.all(files.map(file=>uploadCloudinary(file.path,'packages'))):[]

  //       await this.packageUseCase.updatePackage(id,pkgData,deletedImages,newImages)

  //      res.status(200).json({ message: 'Package updated successfully' });


  //     } catch (error:any) {
  //       res.status(500).json({ message: error.message || 'Something went wrong' });

  //     }
  //  }


  editPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;
    const files = req.files as Express.Multer.File[];
    // Parse fields if they are JSON strings
const deletedImages: { public_id: string }[] = body.deletedImages
  ? JSON.parse(body.deletedImages)
  : [];
  console.log(deletedImages,'edit pkg')

    const location = body.location ? JSON.parse(body.location) : undefined;
    const category = body.category ? JSON.parse(body.category) : undefined;

    const pkgData: Partial<IPackage> = {
      title: body.title,
      description: body.description,
      duration: body.duration,
      price: body.price ? Number(body.price) : undefined,
      location,
      category
    };

const newImages: { url: string; public_id: string }[] = files?.length
  ? await Promise.all(files.map(file => uploadCloudinary(file.path, 'packages')))
  : [];
    await this.packageUseCase.editPackageData(id, pkgData, deletedImages, newImages);

    res.status(200).json({ message: 'Package updated successfully' });

  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};


  blockPackage=async(req:Request,res:Response):Promise<void>=>{
   try {
      const {id}=req.params
      console.log(id,'pid')
      await this.packageUseCase.block(id)
      res.status(200).json({ message: "Package blocked successfully" });

   } catch (error:any) {
       res.status(500).json({ message: error.message || 'Something went wrong' });

   }
  }

    unblockPackage=async(req:Request,res:Response):Promise<void>=>{
   try {
      const {id}=req.params
      await this.packageUseCase.unblock(id)
      res.status(200).json({ message: "Package unblocked successfully" });

   } catch (error:any) {
       res.status(500).json({ message: error.message || 'Something went wrong' });

   }
  }

   deletePackage=async(req:Request,res:Response):Promise<void>=>{
   try {
      const {id}=req.params
      await this.packageUseCase.delete(id)
      res.status(200).json({ message: "Package deleted successfully" });

   } catch (error:any) {
       res.status(500).json({ message: error.message || 'Something went wrong' });

   }
  }


}