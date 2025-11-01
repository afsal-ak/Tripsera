import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { Button } from '@/components/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, MapPin, Clock, Calendar, Check, Heart, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

import type { IPackage } from '@/types/IPackage';
import { fetchPackgeById } from '@/services/user/PackageService';
import {
  addToWishlist,
  deleteFromWishlist,
  checkPackageInWishlist,
} from '@/services/user/wishlistService';
import { handlePackageReview, handleReviewRating } from '@/services/user/reviewService';
import RatingSummary from '../../reviews/RatingSummary';
import type { IReview } from '@/types/IReview';
import type { IRating } from '@/types/IReview';
import { toast } from 'sonner';
import { formatTimeAgo } from '@/lib/utils/formatTime';
import ReadMore from '@/components/ReadMore';
import PackageDetailPickUp from './PackageDetailPickUp';
import { cn } from '@/lib/utils';
const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState<IPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [previewReviews, setPreviewReviews] = useState<IReview[]>([]);
  const [ratingSummary, setRatingSummary] = useState<IRating>();

  useEffect(() => {
    if (!id) {
      return;
    }
    const loadWishListCheck = async () => {
      try {
        const checkWishlist = await checkPackageInWishlist(id);
        //  console.log(checkWishlist.result, 'check')
        setWishlisted(checkWishlist.result);
      } catch (error) {
        console.log(error);
      }
    };
    loadWishListCheck();
  }, []);

  useEffect(() => {
    const loadPackage = async () => {
      if (!id) {
        return;
      }
      try {
        const data = await fetchPackgeById(id);
        console.log(data, 'pkg data');
        setPkg(data as IPackage);
      } catch (error) {
        console.error('Failed to fetch package details', error);
      }
    };
    loadPackage();
  }, [id]);

  const handleWishlist = async () => {
    if (!id || loading) return;
    setLoading(true);

    try {
      if (isWishlisted) {
        await deleteFromWishlist(id);
        toast.success('Removed from wishlist!');
      } else {
        await addToWishlist(id);
        toast.success('Added to wishlist!');
      }
      setWishlisted((prev) => !prev);
    } catch (error: any) {
      toast.error('Please log in');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await handlePackageReview(id!, 1, 3, {});
      console.log(res.review, 'review res ponse');
      const reviewRating = await handleReviewRating(id!);
      setRatingSummary(reviewRating.summary);
      //console.log(reviewRating, 'review')
      setPreviewReviews(res.review.data);
    };
    fetchReviews();
  }, []);
  console.log(ratingSummary, 'rating');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/checkout/${id}`);
  };

  const handleAddReview = () => {
    navigate(`/packages/${id}/review/add`);
  };
  const isSlotFull = pkg?.packageType === 'group' && pkg?.availableSlots! <= 0;
  const isExpired =
    (pkg?.departureDates && new Date(pkg.departureDates) < new Date()) ||
    (pkg?.endDate && new Date(pkg.endDate) < new Date());

  const isBookingDisabled: boolean = Boolean(isSlotFull || isExpired);

  if (!pkg) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  const imageObjects = pkg.imageUrls ?? [];
  const allImages = imageObjects.map((imgObj) =>
    imgObj.url.replace('/upload', '/upload/f_auto,q_auto')
  );
  const currentImage = allImages[selectedImage] ?? '/fallback.jpg';
  const locationLabel = pkg.location?.map((l) => l.name).join(', ') ?? 'Unknown';
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image Gallery */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-6">
            <span>
              <Link to="/home">Home</Link>
            </span>{' '}
            /{' '}
            <span>
              <Link to="/packages">Packages</Link>
            </span>
            / <span className="text-foreground">{pkg.title}</span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-orange text-white px-3 py-1">{pkg.durationDays}D/{pkg.durationNights}N Days</Badge>

                {ratingSummary && (
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-orange mr-1 fill-current" />
                    <span className="font-medium">{ratingSummary.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">
                      ({ratingSummary.totalReviews}{' '}
                      {ratingSummary.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{pkg.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{locationLabel}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="icon"
                className="border-orange text-orange hover:bg-orange hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                onClick={handleWishlist}
                disabled={loading}
                variant={isWishlisted ? 'default' : 'outline'}
                size="icon"
                className={
                  isWishlisted
                    ? 'bg-orange text-white hover:bg-orange/90'
                    : 'border-orange text-orange hover:bg-orange hover:text-white'
                }
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
          {/* Image Gallery */}
          <div className="w-full  max-w-7xl  mx-auto mb-10">
            <div className="flex flex-col items-center gap-4">
              {/*  Image Gallery */}
              <div className="w-full max-w-7xl mx-auto mb-10">
                <div className="flex flex-col items-center gap-4">
                  {/* Main Image */}
                  <div className="w-full h-[600px] md:h-[500px] rounded-xl overflow-hidden relative">
                    <img
                      src={currentImage}
                      alt={`Image ${selectedImage + 1}`}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 text-sm rounded-lg">
                      {selectedImage + 1} / {allImages.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 w-full">
                    {allImages.map((image, index) => {
                      const isSelected = selectedImage === index;
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-[96px] overflow-hidden rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-orange ring-offset-2' : 'hover:opacity-80'
                            }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && <div className="absolute inset-0 bg-orange/20" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{pkg.description}</p>
            </section>
            <PackageDetailPickUp startPoint={pkg?.startPoint!} />

            {/* Itinerary */}
            <section className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Day by Day Itinerary</h2>
              <div className="space-y-4">
                {pkg?.itinerary?.map((day, index) => (
                  <Card
                    key={index}
                    className="border-l-4 border-l-orange hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-1">
                            {day.title}
                          </h3>
                          {day.description && (
                            <p className="text-sm text-muted-foreground mb-3">{day.description}</p>
                          )}
                          <ul className="space-y-2">
                            {day.activities
                              .sort((a, b) => a.startTime.localeCompare(b.startTime))
                              .map((activity, actIndex) => {
                                const formatTime = (time24: string) => {
                                  const [hourStr, minute] = time24.split(':');
                                  let hour = parseInt(hourStr, 10);
                                  const ampm = hour >= 12 ? 'PM' : 'AM';
                                  hour = hour % 12 || 12;
                                  return `${hour}:${minute} ${ampm}`;
                                };

                                return (
                                  <li key={actIndex} className="flex items-center space-x-2">
                                    <span className="text-orange font-semibold">
                                      {formatTime(activity.startTime)} -{' '}
                                      {formatTime(activity.endTime)}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {activity.activity}
                                    </span>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* What's Included */}
            <section className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What's Included & Not Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.included?.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600 flex items-center">
                    <span className="w-5 h-5 mr-2 text-red-600">×</span>
                    Not Included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.notIncluded?.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0">×</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-4 border-2 border-orange/20 shadow-lg">
              <CardContent className="p-8">
                {/* PRICE + OFFER */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2 space-x-3 relative">
                    {pkg.offer && pkg.offer.isActive && new Date(pkg.offer.validUntil) > new Date() ? (
                      <>
                        {/* Original Price (strike-through) */}
                        {pkg.price !== pkg.finalPrice && (
                          <span className="text-sm text-gray-400 line-through">₹{pkg.price}</span>
                        )}

                        {/* Discounted Price */}
                        <span className="text-4xl font-extrabold text-orange">
                          ₹{pkg.finalPrice}
                        </span>

                        {/* Discount Badge */}
                        <span className="absolute -top-2 -right-6 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                          {pkg.offer.type === 'percentage'
                            ? `${pkg.offer.value}% OFF`
                            : `₹${pkg.offer.value} OFF`}
                          <br />
                          <span className="block text-[9px] mt-0.5">{pkg.offer.name}</span>
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-extrabold text-orange drop-shadow-sm">
                        ₹{pkg.finalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">per adult</span>
                </div>

                {/* EXTRA DETAILS SECTION */}
                <div className="space-y-4 mb-8">
                  {/* Adult Price */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium text-gray-700">Adult Price</span>
                    <span className="text-sm font-semibold text-gray-800">₹{pkg.price}</span>
                  </div>

                  {/* Child Price */}
                  {pkg.pricePerChild && (
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-sm font-medium text-gray-700">Child Price</span>
                      <span className="text-sm font-semibold text-gray-800">₹{pkg.pricePerChild}</span>
                    </div>
                  )}

                  {/* Package Type */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium text-gray-700">Package Type</span>
                    <span
                      className={`text-sm font-semibold ${pkg.packageType === 'custom'
                          ? 'text-blue-600'
                          : pkg.packageType === 'group'
                            ? 'text-purple-600'
                            : 'text-green-600'
                        }`}
                    >
                      {pkg.packageType === 'custom'
                        ? 'Custom Package'
                        : pkg.packageType === 'group'
                          ? 'Group Package'
                          : 'Normal Package'}
                    </span>
                  </div>

                  {/* Available Slots (Group only) */}
                  {pkg.packageType === 'group' && (
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-sm font-medium text-gray-700">Available Slots</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {pkg.availableSlots ?? 'N/A'}
                      </span>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-orange mr-3" />
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {pkg?.durationDays !== null && pkg?.durationNights !== null
                        ? `${pkg.durationDays} Days ${pkg.durationNights} Nights`
                        : pkg?.duration || 'N/A'}
                    </span>
                  </div>

                  {/* Departure Dates */}
                  {pkg?.departureDates && (
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-orange mr-3" />
                        <span className="text-sm font-medium text-gray-700">Departure Date</span>
                      </div>
                      <span className="text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md shadow-sm border border-gray-100">
                        {new Date(pkg.departureDates).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                    {pkg?.startDate && (
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-orange mr-3" />
                        <span className="text-sm font-medium text-gray-700">Start Date </span>
                      </div>
                      <span className="text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md shadow-sm border border-gray-100">
                        {new Date(pkg.startDate).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {pkg?.endDate && (
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-orange mr-3" />
                        <span className="text-sm font-medium text-gray-700">End Date </span>
                      </div>
                      <span className="text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md shadow-sm border border-gray-100">
                        {new Date(pkg.endDate).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* BUTTONS */}
                <div className="space-y-3">
                  <Button
                    onClick={handleClick}
                    disabled={isBookingDisabled}
                    className={cn(
                      "w-full py-3 text-lg font-semibold transition-all",
                      isBookingDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange hover:bg-orange-dark text-white"
                    )}
                  >
                    {isSlotFull
                      ? "Slots Full"
                      : isExpired
                        ? "Package Expired"
                        : "Book Now"}
                  </Button>


                  <Button
                    variant="outline"
                    className="w-full border-orange text-orange hover:bg-orange hover:text-white py-3"
                  >
                    Contact Us
                  </Button>
                </div>

              </CardContent>
            </Card>



          </div>
        </div>
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

          <div>
            <RatingSummary summary={ratingSummary} />
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {previewReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={review?.userId?.profileImage?.url || '/profile-default.jpg'}
                    alt={review.userId.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{review.userId.username}</h3>
                        {/* {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )} */}
                      </div>
                      <span className="text-sm text-gray-500">
                        <span>{formatTimeAgo(review.createdAt)}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">{renderStars(review.rating)}</div>
                      <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>

                    <ReadMore text={review.comment} wordLimit={10} />
                    <div className="flex items-center gap-4 text-sm text-gray-500"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(`/packages/${id}/review?page=1&limit=10`)}
            className="text-orange font-semibold mt-2 hover:underline"
          >
            See all reviews →
          </button>
          <br />
          <br />
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleAddReview}
              className="bg-orange text-white px-4 py-2 rounded-md hover:bg-orange-dark transition"
            >
              Write a Review
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PackageDetails;
