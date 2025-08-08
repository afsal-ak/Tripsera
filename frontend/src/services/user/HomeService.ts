import userApi from '@/lib/axios/userAxios';
import type { IBanner, IPackage } from '@/types/homeTypes';

// export const fetchHomeData=async():Promise<{banners:IBanner[];packages:IPackage[]}>=>{
//   const res=await api.get('/home');
//   return res.data
// }

// export const fetchHomeData = async (): Promise<{ result: { banners: IBanner[]; packages: IPackage[] } }> => {
//   const res=await api.get('/home');
//   console.log(res.data,'res')
//   return res.data
// }

export const fetchHomeData = async (): Promise<{
  result: { banners: IBanner[]; packages: IPackage[] };
}> => {
  const res = await userApi.get('/home');
  return res.data;
};
