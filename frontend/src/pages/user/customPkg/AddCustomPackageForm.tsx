import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/Label';
import { Button } from '@/components/Button';

import { createCustomPkg } from '@/services/user/customPkgService';
import { customPkgSchema, type CustomPkgFormSchema } from '@/schemas/customPkgSchema';

const AddCustomPkgForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomPkgFormSchema>({
    resolver: zodResolver(customPkgSchema),
    defaultValues: {
      destination: '',
      startingPoint: '',
      tripType: 'romantic',
      budget: 0,
      startDate: '',
      days: 1,
      nights: 0,
      adults: 1,
      children: 0,
      accommodation: 'standard',
      additionalDetails: '',
    },
  });

  const onSubmit = async (data: CustomPkgFormSchema) => {
    try {
      await createCustomPkg(data);
      reset();
      navigate("/account/my-custom-package"); 
      toast.success('Custom Package submitted')
     } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit package ');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 max-w-screen-md mx-auto bg-white shadow-md p-6 rounded-xl"
    >
      <h2 className="text-lg text-center font-semibold">Create Your Own Packages</h2>

      <div className="mt-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          {...register('guestInfo.name')}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="Enter guest name"
        />
        {errors.guestInfo?.name && (
          <p className="text-red-500 text-sm">{errors.guestInfo.name.message}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          {...register('guestInfo.email')}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="Enter guest email"
        />
        {errors.guestInfo?.email && (
          <p className="text-red-500 text-sm">{errors.guestInfo.email.message}</p>
        )}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="tel"
          {...register('guestInfo.phone')}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="Enter 10-digit phone number"
        />
        {errors.guestInfo?.phone && (
          <p className="text-red-500 text-sm">{errors.guestInfo.phone.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="destination">Destination</Label>
        <Input id="destination" placeholder="Enter your destination" {...register('destination')} />
        {errors.destination && <p className="text-red-500 text-sm">{errors.destination.message}</p>}
      </div>
      <div>
        <Label htmlFor="destination">Starting Point</Label>
        <Input id="startingPoint" placeholder="Enter your startingPoint" {...register('startingPoint')} />
        {errors.startingPoint && <p className="text-red-500 text-sm">{errors.startingPoint.message}</p>}
      </div>
      {/* Trip Type */}
      <div>
        <Label htmlFor="tripType">Trip Type</Label>
        <select id="tripType" {...register('tripType')} className="border rounded-md p-2 w-full">
          <option value="romantic">Romantic</option>
          <option value="adventure">Adventure</option>
          <option value="family">Family</option>
          <option value="luxury">Luxury</option>
          <option value="budget">Budget</option>
          <option value="other">Other</option>
        </select>
        {errors.tripType && <p className="text-red-500 text-sm">{errors.tripType.message}</p>}
      </div>

      {/* Budget */}
      <div>
        <Label htmlFor="budget">Budget (₹)</Label>
        <Input
          id="budget"
          type="number"
          placeholder="Enter your budget"
          {...register('budget', { valueAsNumber: true })}
        />
        {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
      </div>

      {/* Start Date */}
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" {...register('startDate')} />
        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
      </div>

      {/* Days & Nights */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="days">Days</Label>
          <Input id="days" type="number" min={1} {...register('days', { valueAsNumber: true })} />
          {errors.days && <p className="text-red-500 text-sm">{errors.days.message}</p>}
        </div>
        <div className="flex-1">
          <Label htmlFor="nights">Nights</Label>
          <Input
            id="nights"
            type="number"
            min={0}
            {...register('nights', { valueAsNumber: true })}
          />
          {errors.nights && <p className="text-red-500 text-sm">{errors.nights.message}</p>}
        </div>
      </div>

      {/* Adults & Children */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="adults">Adults</Label>
          <Input
            id="adults"
            type="number"
            min={1}
            {...register('adults', { valueAsNumber: true })}
          />
          {errors.adults && <p className="text-red-500 text-sm">{errors.adults.message}</p>}
        </div>
        <div className="flex-1">
          <Label htmlFor="children">Children</Label>
          <Input
            id="children"
            type="number"
            min={0}
            {...register('children', { valueAsNumber: true })}
          />
          {errors.children && <p className="text-red-500 text-sm">{errors.children.message}</p>}
        </div>
      </div>

      {/* Accommodation */}
      <div>
        <Label htmlFor="accommodation">Accommodation</Label>
        <select
          id="accommodation"
          {...register('accommodation')}
          className="border rounded-md p-2 w-full"
        >
          <option value="luxury">Luxury</option>
          <option value="standard">Standard</option>
          <option value="budget">Budget</option>
        </select>
        {errors.accommodation && (
          <p className="text-red-500 text-sm">{errors.accommodation.message}</p>
        )}
      </div>

      {/* Additional Details */}
      <div>
        <Label htmlFor="additionalDetails">Additional Details</Label>
        <textarea
          id="additionalDetails"
          placeholder="Any special requests or notes..."
          {...register('additionalDetails')}
          className="border rounded-md p-2 w-full"
          rows={3}
        />
        {errors.additionalDetails && (
          <p className="text-red-500 text-sm">{errors.additionalDetails.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Package'}
      </Button>
    </form>
  );
};

export default AddCustomPkgForm;
