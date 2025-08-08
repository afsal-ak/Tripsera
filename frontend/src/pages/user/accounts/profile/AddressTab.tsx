import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/Button';
import type { IUser } from '@/types/IUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AddressFormSchema, AddressSchema } from '@/schemas/AddressFormSchema';
import { updateUserAddress } from '@/services/user/profileService';

import { toast } from 'sonner';
type Props = {
  user?: IUser;
  loading?: boolean;
};

const AddressTab = ({ user, loading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormSchema>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
      country: user?.address?.country || 'India',
    },
  });

  const onSubmit = async (data: AddressFormSchema) => {
    console.log('d');
    try {
      const response = await updateUserAddress(data);
      //toast.success("Profile updated successfully");

      console.log({ response });
      toast.success(response.message);
    } catch (error: any) {
      console.log(error, 'error');
      toast.error(error?.response?.data?.message || 'Failed to update coupon');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border rounded-2xl shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Address Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="street">Street</Label>
            <Input id="street" {...register('street')} placeholder="MG Road" />
            {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} placeholder="Malappuram" />
            {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register('state')} placeholder="Kerala" />
            {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
          </div>

          <div>
            <Label htmlFor="zip">PIN Code</Label>
            <Input id="zip" {...register('zip')} placeholder="560001" />
            {errors.zip && <p className="text-sm text-red-500">{errors.zip.message}</p>}
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register('country')} placeholder="India" />
            {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
          </div>
        </div>
        <div className="pt-4">
          <Button type="submit" className="w-full md:w-auto">
            {loading ? 'Updating...' : 'Update Address'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressTab;
