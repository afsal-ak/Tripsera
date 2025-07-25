// // import React, { useState, useCallback } from 'react';
// // import Cropper from 'react-easy-crop';
// // import type { Area } from 'react-easy-crop';
// // import { getCroppedImg } from '@/lib/utils/cropUtils';
// // import { Button } from '../components/Button';

// // interface Props {
// //   image: string;
// //   onCropComplete: (croppedFile: File, previewUrl: string) => void;
// //   onCancel: () => void;
// // }

// // const ImageCropper: React.FC<Props> = ({ image, onCropComplete, onCancel }) => {
// //   const [crop, setCrop] = useState({ x: 0, y: 0 });
// //   const [zoom, setZoom] = useState(1);
// //   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

// //   const onCropCompleteCallback = useCallback(
// //     (_croppedArea: Area, croppedPixels: Area) => {
// //       setCroppedAreaPixels(croppedPixels);
// //     },
// //     []
// //   );

// //   const handleDone = async () => {
// //     try {
// //       if (!croppedAreaPixels) return;
// //       const { file, previewUrl } = await getCroppedImg(image, croppedAreaPixels);
// //       onCropComplete(file, previewUrl);
// //     } catch (e) {
// //       console.error('Crop failed:', e);
// //     }
// //   };

// //   return (
// //     <div className="relative w-full h-[400px] bg-black rounded-md overflow-hidden">
// //       <Cropper
// //         image={image}
// //         crop={crop}
// //         zoom={zoom}
// //         aspect={16 / 9}
// //         onCropChange={setCrop}
// //         onZoomChange={setZoom}
// //         onCropComplete={onCropCompleteCallback}
// //       />
// //       <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
// //         <Button variant="outline" onClick={onCancel}>
// //           Cancel
// //         </Button>
// //         <Button onClick={handleDone}>Crop</Button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ImageCropper;
// import React, { useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';
// import type { Area } from 'react-easy-crop';
// import { getCroppedImg } from '@/lib/utils/cropUtils';
// import { Button } from '../components/Button';
// import imageCompression from "browser-image-compression";

// interface Props {
//   image: string;
//   onCropComplete: (croppedFile: File, previewUrl: string) => void;
//   onCancel: () => void;
//   aspect?: number; // optional aspect ratio (default 16:9)
// }

// const ImageCropper: React.FC<Props> = ({ image, onCropComplete, onCancel, aspect = 16 / 9 }) => {
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

//   // Capture crop area
//   const onCropCompleteCallback = useCallback((_croppedArea: Area, croppedPixels: Area) => {
//     setCroppedAreaPixels(croppedPixels);
//   }, []);

//   // // Handle final crop
//   // const handleDone = async () => {
//   //   try {
//   //     if (!croppedAreaPixels) return;
//   //     const { file, previewUrl } = await getCroppedImg(image, croppedAreaPixels);
//   //     onCropComplete(file, previewUrl);
//   //   } catch (e) {
//   //     console.error('Crop failed:', e);
//   //   }
//   // };

// // const handleDone = async () => {
// //   try {
// //     if (!croppedAreaPixels) return;
// //     const { file, previewUrl } = await getCroppedImg(image, croppedAreaPixels);

// //     // Compress cropped file
// //     const compressedFile = await imageCompression(file, {
// //       maxSizeMB: 1,             // Target size ~1MB
// //       maxWidthOrHeight: 1920,   // Resize large images
// //       useWebWorker: true,
// //     });

// //     console.log(`Cropped Size: ${(file.size / 1024).toFixed(2)} KB`);
// //     console.log(`Compressed Size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

// //     onCropComplete(compressedFile, previewUrl);
// //   } catch (e) {
// //     console.error('Crop failed:', e);
// //   }
// // };
// const handleDone = async () => {
//   try {
//     if (!croppedAreaPixels) return;
//     const { file, previewUrl } = await getCroppedImg(image, croppedAreaPixels);

//     const compressedBlob = await imageCompression(file, {
//       maxSizeMB: 1,
//       maxWidthOrHeight: 1920,
//       useWebWorker: true,
//     });

//     // Ensure it is a File
//     const compressedFile = new File(
//       [compressedBlob],
//       file.name || 'cropped.jpg',
//       { type: compressedBlob.type }
//     );
//      console.log(`Cropped Size: ${(file.size / 1024).toFixed(2)} KB`);
//     console.log(`Compressed Size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

//     onCropComplete(compressedFile, previewUrl);
//   } catch (e) {
//     console.error('Crop failed:', e);
//   }
// };

//   return (
//     <div className="relative w-full h-[400px] bg-black rounded-md overflow-hidden">
//       <Cropper
//         image={image}
//         crop={crop}
//         zoom={zoom}
//         aspect={aspect}
//         onCropChange={setCrop}
//         onZoomChange={setZoom}
//         onCropComplete={onCropCompleteCallback}
//       />

//       {/* Zoom Slider */}
//       <div className="absolute bottom-16 left-0 right-0 flex justify-center">
//         <input
//           type="range"
//           min={1}
//           max={3}
//           step={0.1}
//           value={zoom}
//           onChange={(e) => setZoom(Number(e.target.value))}
//           className="w-1/2 accent-blue-500"
//         />
//       </div>

//       {/* Action Buttons */}
//       <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 bg-black/40 p-2 rounded-md">
//         <Button variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button onClick={handleDone}>Crop</Button>
//       </div>
//     </div>
//   );
// };

// export default ImageCropper;
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/utils/cropUtils";
import { Button } from "@/features/components/Button";
import imageCompression from "browser-image-compression";

interface Props {
  image: string;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<Props> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleDone = async () => {
    try {
      if (!croppedAreaPixels) return;
      const { file, previewUrl } = await getCroppedImg(image, croppedAreaPixels);

      // Compress cropped file
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const compressedFile = new File([compressedBlob], file.name || "cropped.jpg", {
        type: compressedBlob.type,
      });

      console.log(
        `Original: ${(file.size / 1024).toFixed(2)} KB | Compressed: ${(compressedFile.size / 1024).toFixed(2)} KB`
      );

      onCropComplete(compressedFile, previewUrl);
    } catch (e) {
      console.error("Crop failed:", e);
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-black rounded-md overflow-hidden">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={16 / 9}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteCallback}
      />
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-1/2"
        />
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleDone}>Crop & Compress</Button>
      </div>
    </div>
  );
};

export default ImageCropper;
