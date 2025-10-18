import type { IPackage } from '@/types/IPackage';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface Props {
  pkg: IPackage;
}

const PackageCard = ({ pkg }: Props) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/packages/${pkg._id}`);

  const image = pkg.imageUrls?.[0]?.url.replace('/upload/', '/upload/f_auto,q_auto/') || '';

  // Check if offer is active and valid
  const now = new Date();
  const hasValidOffer = pkg.offer?.isActive && new Date(pkg.offer.validUntil) > now;

  // Calculate final price
  const finalPrice = pkg.finalPrice ?? pkg.finalPrice;

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-background rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1 duration-200 border border-border relative"
    >
      {/* Discount badge */}
      {hasValidOffer && pkg.price !== finalPrice && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
          {pkg.offer?.type === 'percentage'
            ? `${pkg.offer.value}% OFF`
            : `₹${pkg.offer?.value} OFF`}
          <br />
          <span className="block text-[9px] mt-0.5">{pkg.offer?.name}</span>
        </span>
      )}

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
          <div className="flex items-center space-x-2">
            {/* Show original price if discounted */}
            {pkg.price !== finalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{pkg.price}</span>
            )}
            <span className="text-orange font-bold text-sm">₹{finalPrice}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-5 h-5 mr-2" />
          <p>{pkg.location?.map((loc) => loc.name).join(', ')}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-semibold">
            {pkg.durationDays != null && pkg.durationNights != null
              ? `${pkg.durationDays}D/${pkg.durationNights}N`
              : pkg.duration || 'N/A'}
          </span>
          <button className="text-sm font-medium text-orange hover:underline">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
