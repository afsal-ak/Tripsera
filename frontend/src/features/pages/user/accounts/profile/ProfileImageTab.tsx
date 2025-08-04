import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { setUser } from '@/redux/slices/userAuthSlice';
import { useImageUpload } from '@/features/hooks/useImageUpload';
import { updateProfilepic, updateUserProfile } from '@/features/services/user/profileService';
import { ProfileSchema, type ProfileFormSchema } from '@/features/schemas/ProfileFormSchema';
import { Input } from '@/features/components/ui/Input';
import { Label } from '@/features/components/ui/Lable';
import { Button } from '@/features/components/Button';
import { Textarea } from '@//components/ui/textarea';
import ImageCropper from '@/features/components/ImageCropper';
import type { IUser } from '@/features/types/IUser';
import CoverImageTab from './CoverImage';
import { toast } from 'sonner';
 type Props = {
  user?: IUser;
  loading: boolean;
};

const ProfileImageTab = ({ user, loading }: Props) => {
  const accessToken = useSelector((state: RootState) => state.userAuth.accessToken);
  const currentUser = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch<AppDispatch>();

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

  const profilePicPreview = user?.profileImage?.url
    ? user.profileImage.url.replace('/upload/', '/upload/f_webp,q_auto/')
    : '/profile-default.jpg';

  const uploadProfileImage = async (file: File) => {
    try {
      setLoadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const updatedUser = await updateProfilepic(formData);

      dispatch(
        setUser({
          user: {
            ...currentUser!,
            profileImage: updatedUser?.profileImage,
          },
          accessToken: accessToken!,
        })
      );

      toast.success('Profile image updated!');
      handleCropCancel(); // close cropper modal
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoadingImage(false);
    }
  };

   
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
      
      {/* Profile Image Section */}
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
                  await uploadProfileImage(croppedImages[0]);
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



      {/* Crop Modal */}
      {currentImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
          <div className="bg-white p-4 rounded-md w-full max-w-[400px] flex flex-col items-center">
            {loadingImage ? (
              <p className="text-sm text-gray-500">Uploading...</p>
            ) : (
              <ImageCropper
                image={currentImage}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
              />
            )}
          </div>
        </div>
      )}

     
    </div>
  );
};

export default ProfileImageTab;
