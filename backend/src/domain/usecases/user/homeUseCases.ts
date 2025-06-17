import { IBannerRepository } from "@domain/repositories/IBannerRepository";
import { IBanner } from "@domain/entities/IBanner";
import { IPackageQueryOptions } from "@domain/entities/IPackageQueryOptions";
import { IPackageRepository } from "@domain/repositories/IPackageRepository";
 import { IPackage } from "@domain/entities/IPackage";
export class HomeUseCases{
    constructor(
      private  packageRepo:IPackageRepository,
      private  bannerRepo:IBannerRepository,
     ){}

     async getHome(): Promise<{ banners: IBanner[]; packages: IPackage[] }> {
        const banners=await this.bannerRepo.getAllActiveBanners()
        const packages=await this.packageRepo.getHomeData()
        return {banners,packages}
  }

//   async getActivePackage(options:IPackageQueryOptions):Promise<{
//     data:IPackage[],
//     total:number,
//     totalPages:number,
//     currentPage:number
//   }>{
//     const {
//       filters={},
//       page=1,
//       limit=8,
//       sort='newest',
//       search=""
//     }=options

//     if(search){
//       filters.$or=[
//         {title:{$regex:search,$options:'i'}},
//         {"location.name":{$regex:search,$options:'i'}},
//       ]
//     }
// if (filters.category) {
//   filters.category = { $in: [filters.category] };
// }

// if (filters.location) {
//   filters["location.name"] = { $regex: filters.location, $options: "i" };
//   delete filters.location;
// }
//     const sortOption:Record<string,any>={
//        newest: { createdAt: -1 },
//     oldest: { createdAt: 1 },
//     price_asc: { price: 1 },
//     price_desc: { price: -1 },
//     }

//     const skip=(page-1)*limit;
//     const sortBy=sortOption[sort]||sortOption["newest"]

//     const [packages,total]=await Promise.all([
//       this.packageRepo.getActivePackages(filters,skip,limit,sortBy),
//       this.packageRepo.countActivePackages(filters)
//     ])
//   return {
//     data: packages,
//     total,
//     totalPages: Math.ceil(total / limit),
//     currentPage: page,
//   };

//   }
async getActivePackage(options: IPackageQueryOptions): Promise<{
  data: IPackage[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const {
    filters = {},
    page = 1,
    limit = 8,
    sort = "newest",
    search = "",
  } = options;

  const mongoFilter: any = { isBlocked: false };

  // Apply search
  if (search) {
    mongoFilter.$or = [
      { title: { $regex: search, $options: "i" } },
      { "location.name": { $regex: search, $options: "i" } },
    ];
  }

  // Apply filters
  if (filters.location) {
    mongoFilter["location.name"] = { $regex: filters.location, $options: "i" };
  }

  if (filters.category) {
    mongoFilter.category = filters.category;
  }

  // if (filters.duration) {
  //   const range = filters.duration;
  //   if (range === "1") mongoFilter.duration = { $gte: 15 };
  //   else {
  //     const [min, max] = range.split("-").map(Number);
  //     mongoFilter.duration = { $gte: min, $lte: max };
  //   }
  // }
if (filters.duration) {
  const durationValue = filters.duration;

  if (!isNaN(Number(durationValue))) {
    // For exact match like "5"
    mongoFilter.duration = Number(durationValue);
  } else if (durationValue.includes("-")) {
    // For range like "5-10"
    const [min, max] = durationValue.split("-").map(Number);
    mongoFilter.duration = { $gte: min, $lte: max };
  } else if (durationValue.endsWith("+")) {
    // For "10+" meaning 10 or more days
    const min = parseInt(durationValue.replace("+", ""), 10);
    mongoFilter.duration = { $gte: min };
  }
}
if (filters.startDate || filters.endDate) {
  mongoFilter.startDate = {};

  if (filters.startDate) {
    mongoFilter.startDate.$gte = new Date(filters.startDate as string);
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate as string);
    end.setHours(23, 59, 59, 999); // include full day
    mongoFilter.startDate.$lte = end;
  }
}

console.log(filters.startDate,'date')
console.log(filters.endDate,'date')

  const sortOptions: Record<string, any> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  const skip = (page - 1) * limit;
  const sortBy = sortOptions[sort] || sortOptions["newest"];

  const [packages, total] = await Promise.all([
    this.packageRepo.getActivePackages(mongoFilter, skip, limit, sortBy),
    this.packageRepo.countActivePackages(mongoFilter),
  ]);

  return {
    data: packages,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

  async getPackageById(id:string):Promise<IPackage|null>{
    const pkg=await this.packageRepo.findById(id)
    return pkg
  }
    
}



