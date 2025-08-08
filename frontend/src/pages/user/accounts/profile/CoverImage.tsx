import { useEffect, useState } from 'react';

import { useImageUpload } from '@/hooks/useImageUpload';

import { Button } from '@/components/Button';
import ImageCropper from '@/components/ImageCropper';
import type { IUser } from '@/types/IUser';
import { toast } from 'sonner';
import { uploadCoverpic } from '@/services/user/profileService';
type Props = {
  user?: IUser;
  loading: boolean;
};

const CoverImageTab = ({ user, loading }: Props) => {
 
  const [loadingImage, setLoadingImage] = useState(false);

  const {
    currentImage,
    fileInputRef,
    croppedImages,
    setCroppedImages,
    handleImageChange,
    handleCropComplete,
    handleCropCancel,
  } = useImageUpload({ maxImages: 1, maxSizeMB: 2 });

  const profilePicPreview = user?.coverImage?.url
    ? user.coverImage.url.replace('/upload/', '/upload/f_webp,q_auto/')
    : '/profile-default.jpg';
console.log(profilePicPreview,'cover image')
  const uploadCoverImage = async (file: File) => {
    try {
      setLoadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadCoverpic(formData);

   
      toast.success('Cover image updated!');
      handleCropCancel(); // close cropper modal
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoadingImage(false);
    }
  };

  

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
      {/* Cover Image Section */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={
            croppedImages[0]
              ? URL.createObjectURL(croppedImages[0])
              : profilePicPreview
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-orange shadow-md"
        />

        {/* File input (hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          id="upload"
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Trigger file input
              if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input so same file can be selected again
                fileInputRef.current.click();
              }
            }}
          >
            {croppedImages[0] ? 'Change Image' : 'Choose Image'}
          </Button>

          {/* Show upload and cancel only when there's a cropped image */}
          {croppedImages[0] && (
            <>
              <Button
                type="button"
                onClick={async () => {
                  await uploadCoverImage(croppedImages[0]);
                  setCroppedImages([]); // clear preview
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loadingImage}
              >
                {loadingImage ? 'Uploading...' : 'Upload Image'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  handleCropCancel();
                  setCroppedImages([]);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>



    {currentImage && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl h-[500px] flex flex-col items-center justify-center">
      {loadingImage ? (
        <p className="text-sm text-gray-500">Uploading...</p>
      ) : (
        <ImageCropper
          image={currentImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspect={1280 / 400}
        />
      )}
    </div>
  </div>
)}


    
    </div>
  );
};

export default CoverImageTab;
