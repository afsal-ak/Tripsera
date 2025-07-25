import { ProfileSchema, type ProfileFormSchema } from '@/features/schemas/ProfileFormSchema';
import { updateProfilepic } from '@/features/services/user/profileService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '@/features/services/user/profileService';
import { getCroppedImg } from '@/lib/utils/cropUtils';
import Cropper from 'react-easy-crop';
import { Input } from '@/features/components/ui/Input';
import { Label } from '@/features/components/ui/Lable';
import { Button } from '@/features/components/Button';
import type { IUser } from '@/features/types/IUser';
import { Textarea } from '@//components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Area } from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { setUser } from '@/redux/slices/userAuthSlice';

type Props = {
  user?: IUser;
  loading: boolean;
};

const EditProfileTab = ({ user, loading }: Props) => {
  const accessToken = useSelector((state: RootState) => state.userAuth.accessToken);
  const currentUser = useSelector((state: RootState) => state.userAuth.user);

  const dispatch = useDispatch<AppDispatch>();
  const [image, setImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const profilePicPreview = user?.profileImage?.url
    ? user.profileImage.url.replace('/upload/', '/upload/f_webp,q_auto/')
    : '/profile-default.jpg';

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed');
      return;
    }

    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };
  console.log(currentUser, 'user');
  const handleCropDone = async () => {
    if (!image || !croppedAreaPixels) {
      return;
    }
    setLoadingImage(true);
    try {
      const { file } = await getCroppedImg(image, croppedAreaPixels);
      setCroppedFile(file);

      const formData = new FormData();
      formData.append('image', file);

      const updatedUser = await updateProfilepic(formData);

      if (!accessToken) {
        toast.error('Access token missing. Please log in again.');
        return;
      }

      dispatch(
        setUser({
          user: {
            ...currentUser!,
            profileImage: updatedUser?.profileImage,
          },
          accessToken,
        })
      );

      toast.success('Profile image updated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoadingImage(false);
      setCropModalOpen(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: user?.fullName,
      username: user?.username,
      dob: user?.dob ? new Date(user.dob).toISOString().slice(0, 10) : '',
      gender: user?.gender,
      bio: user?.bio,
      phone: user?.phone?.toString(),
    },
  });

  const handleProfileSubmit = async (data: ProfileFormSchema) => {
    try {
      const response = await updateUserProfile(data);
      if (!accessToken) {
        toast.error('Access token missing. Please log in again.');
        return;
      }

      dispatch(
        setUser({
          user: {
            ...currentUser!,
            username: response?.userProfile?.username,
          },
          accessToken,
        })
      );

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update coupon');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
      {/* Profile Image Form */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={croppedFile ? URL.createObjectURL(croppedFile) : profilePicPreview}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-orange shadow-md"
        />
        <label htmlFor="upload" className="mt-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="upload"
            className="hidden"
          />
          <Button type="button" asChild>
            <span>Change Image</span>
          </Button>
        </label>
      </div>

      {cropModalOpen && image && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
          <div className="bg-white p-4 rounded-md w-full max-w-[400px] flex flex-col items-center">
            <div className="relative w-full h-[300px]">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4 w-full">
              <Button type="button" variant="outline" onClick={() => setCropModalOpen(false)}>
                Cancel
              </Button>
              <Button disabled={loadingImage} type="button" onClick={handleCropDone}>
                {loadingImage ? 'Uploading...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Details Form */}
      <form
        onSubmit={handleSubmit(handleProfileSubmit)}
        className="bg-white p-6 rounded-md shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input {...register('username')} placeholder="Username" />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input {...register('fullName')} placeholder="Full Name" />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input {...register('dob')} type="date" />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              {...register('gender')}
              className="w-full border rounded px-3 py-2 text-sm text-gray-700"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              {...register('bio')}
              placeholder="Tell us about yourself"
              defaultValue={user?.bio}
            />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              {...register('phone')}
              type="number"
              //defaultValue={user?.phone?.toString()}
              placeholder="Phone Number"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full md:w-auto">
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileTab;
