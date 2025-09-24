// import React, { useState } from "react";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";

// interface ImageGalleryProps {
//   images: string[];
//   packageTitle?: string;
//   categories?: string[]; // Optional labels like "Destinations", "Stays"
// }

// const ImageGallery: React.FC<ImageGalleryProps> = ({
//   images,
//   packageTitle = "Package Gallery",
//   categories = ["Destinations", "Stays", "Activities", "Adventures"],
// }) => {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

//   if (!images || images.length === 0) {
//     return (
//       <div className="w-full h-72 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
//         <span className="text-gray-400">No images available</span>
//       </div>
//     );
//   }

//   const nextImage = () =>
//     setSelectedImage((prev) => (prev + 1) % images.length);
//   const prevImage = () =>
//     setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

//   const openFullScreen = (index: number) => {
//     setSelectedImage(index);
//     setIsFullScreenOpen(true);
//   };

//   return (
//     <>
//       {/* Gallery Grid */}
//       <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 h-[400px] md:h-[500px]">
//         {/* Main Large Image */}
//         <div
//           className="md:col-span-2 row-span-2 relative cursor-pointer"
//           onClick={() => openFullScreen(0)}
//         >
//           <img
//             src={images[0]}
//             alt={`${packageTitle} - Main`}
//             className="w-full h-full object-cover rounded-lg"
//           />
//         </div>

//         {/* Small Grid */}
//         {images.slice(1, 5).map((image, index) => {
//           const imgIndex = index + 1;
//           return (
//             <div
//               key={imgIndex}
//               className="relative cursor-pointer"
//               onClick={() => openFullScreen(imgIndex)}
//             >
//               <img
//                 src={image}
//                 alt={`${packageTitle} - ${categories[index] || "Image"}`}
//                 className="w-full h-full object-cover rounded-lg"
//               />

//               {/* Category label */}
//               {categories[index] && (
//                 <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-md text-sm font-medium">
//                   {categories[index]}
//                 </div>
//               )}

//               {/* View All Button on last thumbnail */}
//               {index === 3 && images.length > 5 && (
//                 <button
//                   className="absolute bottom-3 right-3 bg-white text-gray-800 px-3 py-1 rounded-md text-xs font-medium shadow-md hover:bg-gray-50 transition-colors"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openFullScreen(imgIndex);
//                   }}
//                 >
//                   View All Images
//                 </button>
//               )}

//               {/* Overlay showing extra images count */}
//               {index === 3 && images.length > 5 && (
//                 <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
//                   <span className="text-white text-lg font-semibold">
//                     +{images.length - 4}
//                   </span>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Fullscreen Modal */}
//       {isFullScreenOpen && (
//         <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
//           {/* Close */}
//           <button
//             onClick={() => setIsFullScreenOpen(false)}
//             className="absolute top-6 right-6 text-white hover:text-gray-300"
//           >
//             <X className="w-8 h-8" />
//           </button>

//           {/* Counter */}
//           <div className="absolute top-6 left-6 text-white text-lg font-medium">
//             {selectedImage + 1} / {images.length}
//           </div>

//           {/* Navigation */}
//           {images.length > 1 && (
//             <>
//               <button
//                 onClick={prevImage}
//                 className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
//               >
//                 <ChevronLeft className="w-12 h-12" />
//               </button>
//               <button
//                 onClick={nextImage}
//                 className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
//               >
//                 <ChevronRight className="w-12 h-12" />
//               </button>
//             </>
//           )}

//           {/* Main Fullscreen Image */}
//           <div className="w-full h-full flex items-center justify-center p-8">
//             <img
//               src={images[selectedImage]}
//               alt={`${packageTitle} - Fullscreen`}
//               className="max-w-full max-h-full object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ImageGallery;
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  packageTitle?: string;
  categories?: string[]; // Optional labels like "Destinations", "Stays"
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  packageTitle = "Package Gallery",
  categories = ["Destinations", "Stays", "Activities", "Adventures", "Nature", "Events"],
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [isAllImagesOpen, setIsAllImagesOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-72 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const nextImage = () =>
    setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  const openFullScreen = (index: number) => {
    setSelectedImage(index);
    setIsFullScreenOpen(true);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 h-[500px]">
  {/* Left: Main Large Image */}
  <div
    className="relative cursor-pointer"
    onClick={() => openFullScreen(0)}
  >
    <img
      src={images[0]}
      alt={`${packageTitle} - Main`}
      className="w-full h-full object-cover rounded-lg"
    />
  </div>

  {/* Right: Large Column of Thumbnails */}
  <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
    {images.slice(1, 5).map((image, index) => {
      const imgIndex = index + 1;
      const isLastThumb = index === 3; // 4th small image
      return (
        <div
          key={imgIndex}
          className="relative cursor-pointer"
          onClick={() =>
            isLastThumb && images.length > 5
              ? setIsAllImagesOpen(true)
              : openFullScreen(imgIndex)
          }
        >
          <img
            src={image}
            alt={`${packageTitle} - Thumbnail ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />

          {/* Overlay for more images */}
          {isLastThumb && images.length > 5 && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                +{images.length - 4}
              </span>
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>


      {/* Fullscreen Modal (carousel) */}
      {isFullScreenOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close */}
          <button
            onClick={() => setIsFullScreenOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 text-white text-lg font-medium">
            {selectedImage + 1} / {images.length}
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}

          {/* Main Fullscreen Image */}
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={images[selectedImage]}
              alt={`${packageTitle} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* All Images Modal (grid view) */}
      {isAllImagesOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">All Images</h2>
              <button
                onClick={() => setIsAllImagesOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Image ${idx}`}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  onClick={() => {
                    setSelectedImage(idx);
                    setIsAllImagesOpen(false);
                    setIsFullScreenOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
