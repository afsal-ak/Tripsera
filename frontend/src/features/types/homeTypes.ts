// export interface IBanner {
//   _id: string;
//   title: string;
//   description: string;
//   image: {
//     url: string;
//     public_id: string;
//   };
// }
 

export interface IBanner{
    _id?:string;
    title:string;
    description?:string;
 image: {
    url: string;
    public_id: string;
  };
  isBlocked?:boolean    
}
export interface IPackage {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
    location: string[];

  imageUrls: { url: string }[];
  isBlocked: boolean;
}
