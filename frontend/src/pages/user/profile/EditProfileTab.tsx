import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { setUser } from '@/redux/slices/userAuthSlice';
import { updateUserProfile } from '@/services/user/profileService';
import { ProfileSchema, type ProfileFormSchema } from '@/schemas/ProfileFormSchema';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/ui/textarea';
import type { IUser } from '@/types/IUser';
import CoverImageTab from './CoverImage';
import { toast } from 'sonner';
import ProfileImageTab from './ProfileImageTab';
type Props = {
  user?: IUser;
  loading: boolean;
  refetchUser: () => Promise<void>;
};

const EditProfileTab = ({ user, loading, refetchUser }: Props) => {
  const accessToken = useSelector((state: RootState) => state.userAuth.accessToken);
  const currentUser = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch<AppDispatch>();

  // console.log(currentUser,'resux user')
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
      dispatch(
        setUser({
          user: {
            ...currentUser!,
            username: response?.userProfile?.username,
            fullName: response?.userProfile?.fullName,
            phone: response?.userProfile?.phone,
          },
          accessToken: accessToken!,
        })
      );
      await refetchUser();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
      {/* Cover Image Section */}
      <div className="bg-white p-6 rounded-md shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-2">Cover Image</h2>
        <CoverImageTab user={user} loading={loading} />
      </div>

      {/* Profile Image Section */}
      <div className="bg-white p-6 rounded-md shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-2">Profile Image</h2>
        <ProfileImageTab user={user} loading={loading} refetchUser={refetchUser} />
      </div>

      {/* Profile Info Form */}
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
            <Textarea {...register('bio')} placeholder="Tell us about yourself" />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input {...register('phone')} type="number" placeholder="Phone Number" />
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
