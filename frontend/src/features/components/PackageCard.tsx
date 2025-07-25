import type { IPackage } from '../types/IPackage';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
interface Props {
  pkg: IPackage;
}

const PackageCard = ({ pkg }: Props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/packages/${pkg._id}`);
  };
  // console.log(pkg,'pkg')
  // const image = pkg.imageUrls[0]?.url || "";
  const image = pkg.imageUrls[0]?.url.replace('/upload/', '/upload/f_auto,q_auto/') || '';

  //const [packageDetailId,setPackageDetailId]=useState<string | null>(null)

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-white dark:bg-background rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1 duration-200 border border-border"
      >
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
            <span className="text-orange font-bold text-sm">₹{pkg.price}</span>
          </div>
          <MapPin className="w-5 h-5 mr-2" />

          <p className="text-sm text-muted-foreground">{pkg.location?.map((pkg) => pkg.name)}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{pkg.duration} days</span>
            <button className="text-sm font-medium text-orange hover:underline">
              View Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageCard;
