import { useState, useEffect } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Button } from "@/components/Button";
import ImageCropper from "@/components/ImageCropper";
import { toast } from "sonner";
import { uploadFile } from "@/services/user/messageService";

interface Props {
  onUpload: (url: string, caption?: string) => void;
  file?: File | null; 
}

const ImageUpload: React.FC<Props> = ({ onUpload, file }) => {
  const [loadingImage, setLoadingImage] = useState(false);
  const [caption, setCaption] = useState("");

  const {
    currentImage,
    fileInputRef,
    croppedImages,
    setCroppedImages,
    handleImageChange,
    handleCropComplete,
    handleCropCancel,
  } = useImageUpload({ maxImages: 1, maxSizeMB: 2 });

  // When file prop is passed, trigger the flow automatically
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleImageChange({
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const uploadImage = async (file: File, caption?: string) => {
    try {
      setLoadingImage(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const response = await uploadFile(formData);
      const url = response.url;
      console.log(response, "chat image url");

      if (url) {
        onUpload(url, caption);
        toast.success("Image uploaded!");
      }
      setCroppedImages([]);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Preview Section */}
      {croppedImages[0] && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
          {/* Large Preview */}
          <div className="max-w-[90%] max-h-[70%]">
            <img
              src={URL.createObjectURL(croppedImages[0])}
              alt="Preview"
              className="rounded-lg object-contain w-full h-full"
            />
          </div>

          {/* Caption input */}
          <input
            type="text"
            placeholder="Add a caption..."
            className="w-full max-w-md mt-4 px-4 py-2 rounded-lg text-sm bg-white/90 focus:outline-none"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Action Buttons */}
          <div className="flex gap-6 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                handleCropCancel();
                setCroppedImages([]);
                setCaption("");
              }}
              className="bg-gray-700 text-white hover:bg-gray-600 px-6 py-2 rounded-full"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() => uploadImage(croppedImages[0], caption)}
              disabled={loadingImage}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
            >
              {loadingImage ? "Uploading..." : "Send"}
            </Button>
          </div>
        </div>
      )}

      {/* Hidden Input (fallback for internal picking) */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Cropper Modal */}
      {currentImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl h-[500px] flex flex-col">
            {loadingImage ? (
              <p className="text-sm text-gray-500">Uploading...</p>
            ) : (
              <ImageCropper
                image={currentImage}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
                aspect={4 / 3}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;





// import { useState } from "react";
// import { useImageUpload } from "@/hooks/useImageUpload";
// import { Button } from "@/components/Button";
// import ImageCropper from "@/components/ImageCropper";
// import { toast } from "sonner";
// import { uploadFile } from "@/services/user/messageService";

// interface Props {
//   onUpload: (url: string, caption?: string) => void;
// }

// const ImageUpload: React.FC<Props> = ({ onUpload }) => {
//   const [loadingImage, setLoadingImage] = useState(false);
//   const [caption, setCaption] = useState("");


//   const {
//     currentImage,
//     fileInputRef,
//     croppedImages,
//     setCroppedImages,
//     handleImageChange,
//     handleCropComplete,
//     handleCropCancel,
//   } = useImageUpload({ maxImages: 1, maxSizeMB: 2 });

//   const uploadImage = async (file: File,caption?:string) => {
//     try {
//       setLoadingImage(true);

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("type", "image");

//       const response = await uploadFile(formData);
//       const url = response.url; 
//       console.log(response, 'caht image url')
//       if (url) {
//         onUpload(url,caption);  
//         toast.success("Image uploaded!");
//       }
//       setCroppedImages([]);  
//     } catch (error: any) {
//       console.error("Upload error:", error);
//       toast.error(error?.response?.data?.message || "Failed to upload image");
//     } finally {
//       setLoadingImage(false);
//     }
//   };

//   return (
//     <div className="px-4 py-6 space-y-6">
//       {/* Preview Section */}
//       {croppedImages[0] && (
//   <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
//     {/* Large Preview */}
//     <div className="max-w-[90%] max-h-[70%]">
//       <img
//         src={URL.createObjectURL(croppedImages[0])}
//         alt="Preview"
//         className="rounded-lg object-contain w-full h-full"
//       />
//     </div>
//     {/* caption input */}
//     <input type="text"
//       placeholder="Add a caption..."
//       className="w-full max-w-md mt-4 px-4 py-2 rounded-lg text-sm bg-white/90 focus:outline-none"
//       value={caption}
//       onChange={(e) => setCaption(e.target.value)}
    
//     />

//     {/* Action Buttons */}
//     <div className="flex gap-6 mt-6">
//       <Button
//         type="button"
//         variant="ghost"
//         onClick={() => {
//           handleCropCancel();
//           setCroppedImages([]);
//             setCaption("")
//         }}
//         className="bg-gray-700 text-white hover:bg-gray-600 px-6 py-2 rounded-full"
//       >
//         Cancel
//       </Button>

//       <Button
//         type="button"
//         onClick={() => uploadImage(croppedImages[0],caption)}
//         disabled={loadingImage}
//         className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
//       >
//         {loadingImage ? "Uploading..." : "Send"}
//       </Button>
//     </div>
//   </div>
// )}

//       {/* Hidden Input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         accept="image/*"
//         onChange={handleImageChange}
//         className="hidden"
//       />

//       {/* Trigger Choose Image */}
//       {!croppedImages[0] && (
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => {
//             if (fileInputRef.current) {
//               fileInputRef.current.value = "";
//               fileInputRef.current.click();
//             }
//           }}
//         >
//           Choose Image
//         </Button>
//       )}

//       {/* Cropper Modal */}
//       {currentImage && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
//           <div className="bg-white p-6 rounded-lg w-full max-w-4xl h-[500px] flex flex-col">
//             {loadingImage ? (
//               <p className="text-sm text-gray-500">Uploading...</p>
//             ) : (
//               <ImageCropper
//                 image={currentImage}
//                 onCropComplete={handleCropComplete}
//                 onCancel={handleCropCancel}
//                 aspect={4 / 3} 
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;
