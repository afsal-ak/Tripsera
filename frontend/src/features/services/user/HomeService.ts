import api from "@/lib/axios";
import type { IBanner,IPackage } from "@/features/types/homeTypes";

// export const fetchHomeData=async():Promise<{banners:IBanner[];packages:IPackage[]}>=>{
//   const res=await api.get('/home');
//   return res.data
// }


// export const fetchHomeData = async (): Promise<{ result: { banners: IBanner[]; packages: IPackage[] } }> => {
//   const res=await api.get('/home');
//   console.log(res.data,'res')
//   return res.data
// }

export const fetchHomeData = async (): Promise<{ result: { banners: IBanner[]; packages: IPackage[] } }> => {
  const res = await api.get('/home');
  return res.data;
};



// export const getBanners = async (): Promise<Banner[]> => {
//   const bannerRes = await axiosInstance.get("/getBanner");
//   console.log("Banner API response:", bannerRes.data);

//   return bannerRes.data.banners;  // return the banners array
// };

// // export const getPackages = async (): Promise<TravelPackage[]> => {
// //   const packageRes = await axiosInstance.get("/packages");
// //   return packageRes.data; // assuming it's already an array
// // };
