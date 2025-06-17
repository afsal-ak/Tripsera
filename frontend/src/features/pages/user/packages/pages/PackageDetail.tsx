// import { useState } from "react";
// import { Star } from "lucide-react";
// import { Button } from "@/components/Button";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// const dummyPackage = {
//   id: "1",
//   title: "Mountain Adventure",
//   destination: "Swiss Alps, Switzerland",
//   price: 1299,
//   duration: "7 Days",
//   description:
//     "Experience breathtaking alpine landscapes, cozy lodges, and thrilling outdoor activities. Our mountain adventure package takes you through the heart of the Swiss Alps.",
//   images: [
//     "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
//     "https://images.unsplash.com/photo-1573497019412-40f11dd0c1e3",
//     "https://images.unsplash.com/photo-1582719478170-2d6a1fc713a3",
//     "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
//   ],
//   rating: 4.8,
//   reviews: [
//     {
//       id: 1,
//       name: "Alice",
//       comment: "Incredible experience! Loved every moment.",
//       rating: 5,
//     },
//     {
//       id: 2,
//       name: "John",
//       comment: "Scenery was amazing, guides were professional.",
//       rating: 4.5,
//     },
//   ],
//   features: [
//     "Guided hiking tours",
//     "Luxury mountain lodges",
//     "Traditional Swiss cuisine",
//     "Cable car experiences",
//   ],
// };

// const PackageDetails = () => {
//   const [mainImage, setMainImage] = useState(dummyPackage.images[0]);

//   return (
//     <>
//       <Navbar />
//       <section className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Image Section */}
//           <div>
//             <img
//               src={mainImage}
//               alt="Main"
//               className="w-full h-96 object-cover rounded-2xl shadow"
//             />
//             <div className="flex gap-4 mt-4 overflow-x-auto">
//               {dummyPackage.images.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   onClick={() => setMainImage(img)}
//                   className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
//                     mainImage === img ? "border-orange" : "border-transparent"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Details Section */}
//           <div>
//             <h2 className="text-3xl font-bold text-foreground mb-2">
//               {dummyPackage.title}
//             </h2>
//             <p className="text-muted-foreground mb-1">
//               {dummyPackage.destination}
//             </p>
//             <p className="text-lg font-semibold text-orange mb-2">
//               ₹{dummyPackage.price} / person
//             </p>
//             <p className="text-sm text-muted-foreground mb-4">
//               Duration: {dummyPackage.duration}
//             </p>

//             <p className="text-base text-foreground mb-4">
//               {dummyPackage.description}
//             </p>

//             <h4 className="font-semibold text-lg mb-2">Included Features:</h4>
//             <ul className="list-disc list-inside mb-4 text-muted-foreground">
//               {dummyPackage.features.map((feature, idx) => (
//                 <li key={idx}>{feature}</li>
//               ))}
//             </ul>

//             <Button className="bg-orange hover:bg-orange-dark text-white">
//               Book Now
//             </Button>
//           </div>
//         </div>

//         {/* Review Section */}
//         <div className="mt-16">
//           <h3 className="text-2xl font-bold text-foreground mb-6">
//             Reviews ({dummyPackage.reviews.length})
//           </h3>
//           <div className="space-y-4">
//             {dummyPackage.reviews.map((review) => (
//               <div
//                 key={review.id}
//                 className="p-4 border border-muted rounded-xl shadow-sm"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-semibold">{review.name}</span>
//                   <span className="flex items-center gap-1 text-yellow-500">
//                     {Array.from({ length: Math.floor(review.rating) }).map(
//                       (_, i) => (
//                         <Star key={i} size={16} fill="currentColor" />
//                       )
//                     )}
//                     <span className="ml-1 text-sm text-muted-foreground">
//                       ({review.rating})
//                     </span>
//                   </span>
//                 </div>
//                 <p className="text-muted-foreground text-sm">
//                   {review.comment}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// };

// export default PackageDetails;
  // Mock data with multiple images
  // const packageData = {
  //   id: "1",
  //   title: "Mountain Adventure",
  //   destination: "Swiss Alps, Switzerland",
  //   price: 1299,
  //   duration: "7 Days",
  //   maxPeople: 12,
  //   images: [
  //     "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  //     "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  //     "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  //     "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  //     "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  //     "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  //   ],
  //   rating: 4.8,
  //   reviews: 124,
  //   description: "Embark on an unforgettable journey through the breathtaking Swiss Alps. This carefully crafted adventure combines stunning mountain vistas, authentic cultural experiences, and luxurious accommodations to create the perfect alpine getaway.",
  //   highlights: [
  //     "Guided hiking tours through pristine mountain trails",
  //     "Stay in luxury mountain lodges with panoramic views",
  //     "Traditional Swiss cuisine and wine tasting experiences",
  //     "Cable car rides to spectacular viewpoints",
  //     "Visit charming alpine villages and local markets",
  //     "Professional mountain guide and safety equipment included"
  //   ],
  //   itinerary: [
  //     {
  //       day: 1,
  //       title: "Arrival in Zurich",
  //       activities: ["Airport pickup", "Transfer to mountain lodge", "Welcome dinner"]
  //     },
  //     {
  //       day: 2,
  //       title: "Jungfraujoch Excursion",
  //       activities: ["Cable car to Top of Europe", "Ice palace visit", "Alpine restaurant lunch"]
  //     },
  //     {
  //       day: 3,
  //       title: "Hiking Adventure",
  //       activities: ["Guided mountain hike", "Scenic picnic lunch", "Evening cultural show"]
  //     },
  //     {
  //       day: 4,
  //       title: "Lake Geneva",
  //       activities: ["Boat tour", "Vineyard visit", "Wine tasting"]
  //     },
  //     {
  //       day: 5,
  //       title: "Matterhorn Region",
  //       activities: ["Train journey to Zermatt", "Matterhorn viewing", "Alpine spa relaxation"]
  //     },
  //     {
  //       day: 6,
  //       title: "Adventure Activities",
  //       activities: ["Optional paragliding", "Mountain biking", "Farewell dinner"]
  //     },
  //     {
  //       day: 7,
  //       title: "Departure",
  //       activities: ["Check-out", "Transfer to airport", "Safe travels home"]
  //     }
  //   ],
  const packageData={
    included: [
      "6 nights accommodation in luxury mountain lodges",
      "All meals as specified in itinerary",
      "Professional English-speaking guide",
      "All transportation during the tour",
      "Cable car and train tickets",
      "Travel insurance",
      "24/7 support hotline"
    ],
    notIncluded: [
      "International flights",
      "Personal expenses",
      "Optional activities",
      "Gratuities"
    ]
  };





import { useParams,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

import Navbar from "@/features/components/Navbar";
import Footer from "@/features/components/Footer";
import { Button } from "@/features/components/Button";
import { Badge } from "@/features/components/ui/Badge"
import { Star, MapPin, Clock, Users, Calendar, Check, Heart, Share2 } from "lucide-react";
import { Card,CardContent } from "@/features/components/ui/Card";

import type { IPackage } from "@/features/types/IPackage";
import { fetchPackgeById } from "@/features/services/user/PackageService"; 



const PackageDetails = () => {
 

  const { id } = useParams();
const [pkg, setPkg] = useState<IPackage | null>(null);
   const [selectedImage, setSelectedImage] = useState(0);

  useEffect(()=>{
    const loadPackage=async()=>{
      if(!id){
        return
      }
      try {
        const data=await fetchPackgeById(id)
        setPkg(data)
        console.log(data,'data')
      } catch (error) {
        console.error("Failed to fetch package details", error);

      }
    };
    loadPackage()
   },[id])
 if (!pkg) {
  return <div className="h-screen flex items-center justify-center">Loading...</div>;
}

  // ✅ Simplified data access
  const imageObjects = pkg.imageUrls ?? [];
  const allImages = imageObjects.map((imgObj) => imgObj.url);
  const currentImage = allImages[selectedImage] ?? "/fallback.jpg";
  const locationLabel = pkg.location?.map((l) => l.name).join(", ") ?? "Unknown";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
       {/* Hero Section with Image Gallery */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-6">
            <span>Home</span> / <span>Packages</span> / <span className="text-foreground">{pkg.title}</span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-orange text-white px-3 py-1">{pkg.duration} Days</Badge>
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-orange mr-1 fill-current" />
                  <span className="font-medium">{4.4}</span>
                  {/* <span className="text-muted-foreground ml-1">({pkg.reviews} reviews)</span> */}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{pkg.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{locationLabel}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="icon" className="border-orange text-orange hover:bg-orange hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-orange text-orange hover:bg-orange hover:text-white">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
{/* Image Gallery */}
<div className="w-full  max-w-7xl  mx-auto mb-10">
  <div className="flex flex-col items-center gap-4">
       {/* ✅ Image Gallery */}
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
                      className={`relative h-[96px] overflow-hidden rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected ? "ring-2 ring-orange ring-offset-2" : "hover:opacity-80"
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
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

            {/* Highlights */}
            {/* <section className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Tour Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-orange/5 transition-colors">
                    <div className="w-6 h-6 bg-orange/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-orange" />
                    </div>
                    <span className="text-muted-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </section> */}

            {/* Itinerary */}
            <section className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Day by Day Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary?.map((day, index) => (
                  <Card key={index} className="border-l-4 border-l-orange hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-3">{day.title}</h3>
                          <ul className="text-muted-foreground space-y-2">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="flex items-center">
                                <div className="w-2 h-2 bg-orange rounded-full mr-3 flex-shrink-0"></div>
                                {activity}
                              </li>
                            ))}
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
              <h2 className="text-2xl font-bold text-foreground mb-6">What's Included & Not Included</h2>
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
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-orange">${pkg.price}</span>
                  </div>
                  <span className="text-muted-foreground">per person</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-orange mr-3" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <span className="text-sm font-semibold">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-orange mr-3" />
                      {/* <span className="text-sm font-medium">Max People</span> */}
                    </div>
                    {/* <span className="text-sm font-semibold">{pkg.maxPeople}</span> */}
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-orange mr-3" />
                      <span className="text-sm font-medium">Next Date</span>
                    </div>
                    <span className="text-sm font-semibold">June 15, 2024</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-orange hover:bg-orange-dark text-white py-3 text-lg font-semibold">
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full border-orange text-orange hover:bg-orange hover:text-white py-3">
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Info</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Difficulty Level:</span>
                    <Badge variant="secondary">Moderate</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Best Season:</span>
                    <span className="font-medium">May - October</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Languages:</span>
                    <span className="font-medium">English, German</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Accommodation:</span>
                    <span className="font-medium">4-5 Star Hotels</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetails;
