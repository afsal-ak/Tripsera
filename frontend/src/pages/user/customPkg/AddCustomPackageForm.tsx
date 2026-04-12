import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/Label';
import { Button } from '@/components/Button';
import { createCustomPkg } from '@/services/user/customPkgService';
import { customPkgSchema, type CustomPkgFormSchema } from '@/schemas/customPkgSchema';
import type { RootState } from '@/redux/store';
import type { IPackage } from '@/types/IPackage';
import PackageCard from '@/components/user/PackageCard';

interface Props {
  companyId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const AddCustomPkgForm = ({ companyId, isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.userAuth.user);

  const [suggestedPkgs, setSuggestedPkgs] = useState<IPackage[]>([]);
  const [exactMatch, setExactMatch] = useState<IPackage | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomPkgFormSchema>({
    resolver: zodResolver(customPkgSchema),
    defaultValues: {
      guestInfo: {
        name: userData?.fullName || '',
        phone: userData?.phone ? String(userData.phone) : '',
        email: userData?.email || '',
      },
      // companyId: companyId,
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

  // ❗ Hide if not open
  if (!isOpen) return null;

  const onSubmit = async (data: CustomPkgFormSchema) => {
    try {
      if (!companyId) {
        console.log(companyId,'compamy id i');
        
        toast.error("Company ID missing");
        return;
      }
      const payload = {
        ...data,
        companyId: companyId!,
      };
      const res = await createCustomPkg(payload);
      const result = res.data;

      if (result.status === 'exact_match') {
        setExactMatch(result.package);
        setSuggestedPkgs([]);
        toast.info('An exact package already exists!');
      } else if (result.status === 'similar_found') {
        setSuggestedPkgs(result.similarPackages);
        setExactMatch(null);
        toast.info('We found similar packages!');
      } else if (result.status === 'created') {
        toast.success('Custom package created!');
        reset();
        onClose?.();
        navigate('/account/my-custom-package');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800">
            Plan Your Custom Trip ✈️
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Create your dream travel package
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
<input
  type="hidden"
  {...register("companyId")}
  value={companyId || ""}
/>
          {/* Guest Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input {...register('guestInfo.name')} />
              <p className="text-red-500 text-sm">{errors.guestInfo?.name?.message}</p>
            </div>

            <div>
              <Label>Email</Label>
              <Input {...register('guestInfo.email')} />
              <p className="text-red-500 text-sm">{errors.guestInfo?.email?.message}</p>
            </div>

            <div>
              <Label>Phone</Label>
              <Input {...register('guestInfo.phone')} />
              <p className="text-red-500 text-sm">{errors.guestInfo?.phone?.message}</p>
            </div>

            <div>
              <Label>Starting Point</Label>
              <Input {...register('startingPoint')} />
              <p className="text-red-500 text-sm">{errors.startingPoint?.message}</p>
            </div>
          </div>

          {/* Travel */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Destination</Label>
              <Input {...register('destination')} />
              <p className="text-red-500 text-sm">{errors.destination?.message}</p>
            </div>

            <div>
              <Label>Trip Type</Label>
              <select {...register('tripType')} className="border rounded-md p-2 w-full">
                <option value="romantic">Romantic</option>
                <option value="adventure">Adventure</option>
                <option value="family">Family</option>
                <option value="luxury">Luxury</option>
                <option value="budget">Budget</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Budget (₹)</Label>
              <Input type="number" {...register('budget', { valueAsNumber: true })} />
            </div>

            <div>
              <Label>Start Date</Label>
              <Input type="date" {...register('startDate')} />
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input type="number" placeholder="Days" {...register('days', { valueAsNumber: true })} />
            <Input type="number" placeholder="Nights" {...register('nights', { valueAsNumber: true })} />
            <Input type="number" placeholder="Adults" {...register('adults', { valueAsNumber: true })} />
            <Input type="number" placeholder="Children" {...register('children', { valueAsNumber: true })} />
          </div>

          {/* Accommodation */}
          <div>
            <Label>Accommodation</Label>
            <select {...register('accommodation')} className="border rounded-md p-2 w-full">
              <option value="luxury">Luxury</option>
              <option value="standard">Standard</option>
              <option value="budget">Budget</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <Label>Additional Details</Label>
            <textarea
              {...register('additionalDetails')}
              className="border rounded-md p-2 w-full"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button type="button" onClick={onClose} className="w-full border">
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>

        {/* Results */}
        {exactMatch && (
          <div className="mt-6">
            <h3 className="text-green-600 font-semibold mb-2">Exact Match Found</h3>
            <PackageCard pkg={exactMatch} />
          </div>
        )}

        {suggestedPkgs.length > 0 && (
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {suggestedPkgs.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCustomPkgForm;
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// import { Input } from '@/components/ui/Input';
// import { Label } from '@/components/Label';
// import { Button } from '@/components/Button';
// import { createCustomPkg } from '@/services/user/customPkgService';
// import { customPkgSchema, type CustomPkgFormSchema } from '@/schemas/customPkgSchema';
// import type { RootState } from '@/redux/store';
// import type { IPackage } from '@/types/IPackage';
// import PackageCard from '@/components/user/PackageCard';
// import { X } from 'lucide-react';

// interface Props {
//   companyId?: string;
//   isOpen?: boolean;
//   onClose?: () => void;

// }
// const AddCustomPkgForm = ({ companyId, isOpen, onClose }: Props) => {

//   const navigate = useNavigate();
//   const userData = useSelector((state: RootState) => state.userAuth.user);
//   const [suggestedPkgs, setSuggestedPkgs] = useState<IPackage[]>([]);
//   const [exactMatch, setExactMatch] = useState<IPackage | null>(null);
//   console.log(companyId, 'comapny id in add custom pkg');

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<CustomPkgFormSchema>({
//     resolver: zodResolver(customPkgSchema),
//     defaultValues: {
//       guestInfo: {
//         name: userData?.fullName || '',
//         phone: userData?.phone ? String(userData.phone) : '',
//         email: userData?.email || '',
//       },
//       companyId: companyId,
//       destination: '',
//       startingPoint: '',
//       tripType: 'romantic',
//       budget: 0,
//       startDate: '',
//       days: 1,
//       nights: 0,
//       adults: 1,
//       children: 0,
//       accommodation: 'standard',
//       additionalDetails: '',
//     },
//   });

//   if (!isOpen) {
//     return null
//   }

//   const onSubmit = async (data: CustomPkgFormSchema) => {
//     try {
//       const res = await createCustomPkg(data);
//       const result = res.data;

//       console.log(result, 'custom pkg response');

//       if (result.status === 'exact_match') {
//         setExactMatch(result.package);
//         setSuggestedPkgs([]);
//         toast.info('An exact package already exists!');
//       } else if (result.status === 'similar_found') {
//         setSuggestedPkgs(result.similarPackages);
//         setExactMatch(null);
//         toast.info('We found similar packages for you!');
//       } else if (result.status === 'created') {
//         toast.success('Custom package request created successfully!');
//         reset();
//         navigate('/account/my-custom-package');
//       }
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || 'Failed to submit package');
//     }
//   };

//   return (
//     // <div
//     //   className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center py-10 px-4"
//     // >
// <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 text-black-500 hover:text-black"
//       >aaaa
//         <X size={20} />
//       </button>

//       {/* Form Container */}
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 sm:p-10"
//       >
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-extrabold text-blue-800">
//             Plan Your Custom Travel Package ✈️
//           </h2>
//           <p className="text-gray-600 mt-2 text-sm sm:text-base">
//             Fill out the form below to create your dream travel plan. We'll suggest similar packages
//             if we already have matching ones!
//           </p>
//         </div>

//         {/* --- Guest Info Section --- */}
//         <div className="grid md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label htmlFor="guestInfo.name">Name</Label>
//             <Input {...register('guestInfo.name')} placeholder="Enter your name" />
//             {errors.guestInfo?.name && (
//               <p className="text-red-500 text-sm">{errors.guestInfo.name.message}</p>
//             )}
//           </div>
//           <div>
//             <Label htmlFor="guestInfo.email">Email</Label>
//             <Input {...register('guestInfo.email')} placeholder="Enter your email" />
//             {errors.guestInfo?.email && (
//               <p className="text-red-500 text-sm">{errors.guestInfo.email.message}</p>
//             )}
//           </div>
//           <div>
//             <Label htmlFor="guestInfo.phone">Phone</Label>
//             <Input {...register('guestInfo.phone')} placeholder="Enter phone number" />
//             {errors.guestInfo?.phone && (
//               <p className="text-red-500 text-sm">{errors.guestInfo.phone.message}</p>
//             )}
//           </div>
//           <div>
//             <Label htmlFor="startingPoint">Starting Point</Label>
//             <Input {...register('startingPoint')} placeholder="Enter starting point" />
//             {errors.startingPoint && (
//               <p className="text-red-500 text-sm">{errors.startingPoint.message}</p>
//             )}
//           </div>
//         </div>

//         {/* --- Travel Details --- */}
//         <div className="grid md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label htmlFor="destination">Destination</Label>
//             <Input {...register('destination')} placeholder="Enter destination" />
//             {errors.destination && (
//               <p className="text-red-500 text-sm">{errors.destination.message}</p>
//             )}
//           </div>
//           <div>
//             <Label htmlFor="tripType">Trip Type</Label>
//             <select {...register('tripType')} className="border rounded-md p-2 w-full">
//               <option value="romantic">Romantic</option>
//               <option value="adventure">Adventure</option>
//               <option value="family">Family</option>
//               <option value="luxury">Luxury</option>
//               <option value="budget">Budget</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//         </div>

//         {/* --- Budget & Date --- */}
//         <div className="grid md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label htmlFor="budget">Budget (₹)</Label>
//             <Input type="number" {...register('budget', { valueAsNumber: true })} />
//           </div>
//           <div>
//             <Label htmlFor="startDate">Start Date</Label>
//             <Input type="date" {...register('startDate')} />
//           </div>
//         </div>

//         {/* --- Duration --- */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
//           <div>
//             <Label htmlFor="days">Days</Label>
//             <Input type="number" min={1} {...register('days', { valueAsNumber: true })} />
//           </div>
//           <div>
//             <Label htmlFor="nights">Nights</Label>
//             <Input type="number" min={0} {...register('nights', { valueAsNumber: true })} />
//           </div>
//           <div>
//             <Label htmlFor="adults">Adults</Label>
//             <Input type="number" min={1} {...register('adults', { valueAsNumber: true })} />
//           </div>
//           <div>
//             <Label htmlFor="children">Children</Label>
//             <Input type="number" min={0} {...register('children', { valueAsNumber: true })} />
//           </div>
//         </div>

//         {/* --- Accommodation --- */}
//         <div className="mb-6">
//           <Label htmlFor="accommodation">Accommodation</Label>
//           <select {...register('accommodation')} className="border rounded-md p-2 w-full">
//             <option value="luxury">Luxury</option>
//             <option value="standard">Standard</option>
//             <option value="budget">Budget</option>
//           </select>
//         </div>

//         {/* --- Additional Details --- */}
//         <div className="mb-8">
//           <Label htmlFor="additionalDetails">Additional Details</Label>
//           <textarea
//             {...register('additionalDetails')}
//             className="border rounded-md p-2 w-full"
//             rows={3}
//             placeholder="Any special requests or notes..."
//           />
//         </div>


//         <div className="flex gap-3 pt-2">
//           <Button
//             type="button"
//             onClick={onClose}
//             className="w-full border"
//           >
//             Cancel
//           </Button>

//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-green-600 text-white"
//           >
//             {isSubmitting ? "Creating..." : "Create"}
//           </Button>
//         </div>
//         {/* --- Submit Button --- */}
//         {/* <Button
//           type="submit"
//           className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-lg transition-all"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Package'}
//         </Button> */}
//       </form>

//       {/* --- Exact Match --- */}
//       {exactMatch && (
//         <div className="mt-10 w-full max-w-5xl px-4">
//           <h3 className="text-xl sm:text-2xl font-semibold text-center text-green-700 mb-4">
//             🎯 Exact Package Found
//           </h3>
//           <PackageCard pkg={exactMatch} />
//         </div>
//       )}

//       {/* --- Suggested Packages --- */}
//       {suggestedPkgs.length > 0 && (
//         <div className="mt-10 w-full max-w-6xl px-4">
//           <h3 className="text-xl sm:text-2xl font-semibold text-center text-blue-700 mb-6">
//             ✨ Suggested Packages for You
//           </h3>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {suggestedPkgs.map((pkg) => (
//               <PackageCard key={pkg._id} pkg={pkg} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddCustomPkgForm;
