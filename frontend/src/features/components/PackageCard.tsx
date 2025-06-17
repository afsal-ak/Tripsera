// import { Star } from "lucide-react";
// import type { IPackage } from "../types/homeTypes";
// // type PackageCardProps = {
// //   id: string;
// //   title: string;
// //   destination: string;
// //   price: number;
// //   duration: string;
// //   image: string;
// //   rating: number;
// //   reviews: number;
// //   features: string[];
// // };

// interface Props{
//   packages:IPackage[]
// }

// const PackageCard = ({
// // 
//   packages
// }: Props) => {
//   return (
//     <div className="bg-white dark:bg-background rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1 duration-200 border border-border">
//       <div className="h-48 w-full overflow-hidden">
//         <img
//           src={image}
//           alt={packages.title}
//           className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//         />
//       </div>

//       <div className="p-4 space-y-2">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-foreground">{title}</h3>
//           <span className="text-orange font-bold text-sm">${price}</span>
//         </div>

//         <p className="text-sm text-muted-foreground">{destination}</p>

//         {/* <div className="flex items-center text-sm text-yellow-500 mt-1">
//           <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500 mr-1" />
//           <span>{rating}</span>
//           <span className="text-muted-foreground ml-1">({reviews} reviews)</span>
//         </div> */}

//         {/* <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
//           {features.slice(0, 3).map((feature, idx) => (
//             <li key={idx}>{feature}</li>
//           ))}
//         </ul> */}

//         <div className="mt-4 flex justify-between items-center">
//           <span className="text-sm text-muted-foreground">{packages.duration}</span>
//           <button className="text-sm font-medium text-orange hover:underline">
//             View Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PackageCard;
//import { Star } from "lucide-react";
import type { IPackage } from "@/features/types/homeTypes";
import { useNavigate } from "react-router-dom";
interface Props{
  pkg:IPackage
}

const PackageCard = (  {pkg}: Props ) => {
  const navigate=useNavigate()
    const handleClick=()=>{
    navigate(`/packages/${pkg._id}`)
  }
  console.log(pkg,'pkg')
  const image = pkg.imageUrls[0]?.url || "";
  //const [packageDetailId,setPackageDetailId]=useState<string | null>(null)

  return (
    <>
    <div  onClick={handleClick} className="bg-white dark:bg-background rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1 duration-200 border border-border">
     
      <div className="h-48 w-full overflow-hidden">
        <img
           src={image}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{pkg.title}</h3>
          <span className="text-orange font-bold text-sm">${pkg.price}</span>
        </div>
        <p className="text-sm text-muted-foreground">{pkg.location.join(", ")}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{pkg.duration} days</span>
          <button className="text-sm font-medium text-orange hover:underline" >
            View Details
           </button>
        </div>
      </div>
    </div>
    {/* Conditionally render the details */}
      {/* {packageDetailId === pkg._id && (
        <PackageDetails packageId={packageDetailId} onClose={() => setPackageDetailId(null)} />
      )} */}
    </>
    
  );
};

export default PackageCard;
