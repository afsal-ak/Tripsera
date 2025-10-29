import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { addPackageSchema, type AddPackageFormSchema } from '@/schemas/AddPackageSchema';
import { addPackage } from '@/services/admin/packageService';
import { getCategory } from '@/services/admin/packageService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ImageCropper from '@/components/ImageCropper';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Label } from '@/components/Label';
import { Button } from '@/components/ui/button';


export default function AddPackageForm() {
  const {
    croppedImages,
    setCroppedImages,
    currentImage,
    fileInputRef,
    handleImageChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
  } = useImageUpload({ maxImages: 4, maxSizeMB: 2 });

  const {
    register,
    handleSubmit,
    resetField,
    control,
    setValue,
    watch,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<AddPackageFormSchema>({
    resolver: zodResolver(addPackageSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      durationDays: 1,
      durationNights: 0,
      startDate: '',
      endDate: '',
      category: [],
      startPoint: '',
      location: [
        {
          name: '',
          lat: '',
          lng: '',
        },
      ],

      included: [''],

      notIncluded: [''],
      itinerary: [
        {
          day: 1,
          title: '',
          description: '',
          activities: [{ startTime: '', endTime: '', activity: '' }],
        },
      ],
      images: [],
      offer: { type: 'percentage', value: 0, validUntil: '', isActive: false },
    },
  });
  // keep RHF images in sync with hook state
  useEffect(() => {
    setValue('images', croppedImages, { shouldValidate: true });
  }, [croppedImages, setValue]);

  // categories
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isSubmittingPkg, setIsSubmittingPkg] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const categories = await getCategory();
        if (!mounted) return; // skip state update if unmounted

        // Map to value/label for your Select component
        const options = categories.map((c: any) => ({ value: c._id, label: c.name }));
        setCategoryOptions(options);
      } catch {
        if (!mounted) return;
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  // Field arrays for location, included, notIncluded, itinerary
  const locArray = useFieldArray({ control, name: 'location' as const });
  const itineraryArray = useFieldArray({ control, name: 'itinerary' as const });

  // images & crop state
  const images = watch('images');

  // Submit
  const onSubmit = async (data: AddPackageFormSchema) => {
    try {
      setIsSubmittingPkg(true);

      const form = new FormData();

      croppedImages.forEach((file) => form.append('images', file));

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') return;

        if (Array.isArray(value) || typeof value === 'object') {
          // stringify arrays and objects
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, String(value ?? ''));
        }
      });

      // send
      await addPackage(form);
      navigate('/admin/packages');
      toast.success('Package saved successfullly');
      reset();
      setCroppedImages([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save');
    } finally {
      setIsSubmittingPkg(false);
    }
  };


  const addDay = () => {
    itineraryArray.append({
      day: itineraryArray.fields.length + 1,
      title: '',
      description: '',
      activities: [{ startTime: '', endTime: '', activity: '' }],
    });
  };
  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);


  return (
    <>
      {currentImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
            <h2 className="text-lg font-semibold mb-4">Crop Image</h2>
            <ImageCropper
              image={currentImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
              aspect={16 / 9}
            />
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-100">

        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Add New Package</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in all the required fields to create a new travel package.
          </p>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Add Package</h2>
        {!currentImage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-medium">Title</label>
              <input {...register('title')} className="border p-2 w-full rounded" />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <textarea {...register('description')} className="border p-2 w-full rounded" />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block font-medium">Category</label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    options={categoryOptions}
                    isLoading={loadingCategories}
                    isMulti
                    value={categoryOptions.filter((c) => field.value?.includes(c.value))}
                    onChange={(selected) =>
                      field.onChange((selected as any).map((s: any) => s.value))
                    }
                    isClearable
                  />
                )}
              />
              {errors.category && <p className="text-red-500">{errors.category.message}</p>}
            </div>

            {/* Price & duration */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block">Price</label>
                <input
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className="border p-2 rounded w-full"
                />
                {errors.price && <p className="text-red-500">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block">Days</label>
                <input
                  type="number"
                  {...register('durationDays', { valueAsNumber: true })}
                  className="border p-2 rounded w-full"
                />
                {errors.durationDays && (
                  <p className="text-red-500">{errors.durationDays.message}</p>
                )}
              </div>
              <div>
                <label className="block">Nights</label>
                <input
                  type="number"
                  {...register('durationNights', { valueAsNumber: true })}
                  className="border p-2 rounded w-full"
                />
                {errors.durationNights && (
                  <p className="text-red-500">{errors.durationNights.message}</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="border p-2 rounded w-full"
                />
                {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
              </div>
              <div>
                <label>End Date</label>
                <input type="date" {...register('endDate')} className="border p-2 rounded w-full" />
                {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            {/* Start point */}
            <div>
              <label>Start Point</label>
              <input {...register('startPoint')} className="border p-2 w-full rounded" />
              {errors.startPoint && <p className="text-red-500">{errors.startPoint.message}</p>}
            </div>

            {/* Locations */}
            {/* Locations Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Locations</h3>
                <button
                  type="button"
                  onClick={() => locArray.append({ name: '', lat: '', lng: '' })}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  + Add Location
                </button>
              </div>

              <div className="space-y-4">
                {locArray.fields.map((f, i) => (
                  <div
                    key={f.id}
                    className="border border-gray-200 p-5 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Name Field */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          placeholder="Location Name"
                          {...register(`location.${i}.name` as const)}
                          className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.location?.[i]?.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.location[i]?.name?.message}
                          </p>
                        )}
                      </div>

                      {/* Latitude Field */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input
                          type="text"
                          placeholder="Latitude"
                          {...register(`location.${i}.lat` as const)}
                          className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.location?.[i]?.lat && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.location[i]?.lat?.message}
                          </p>
                        )}
                      </div>

                      {/* Longitude Field */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input
                          type="text"
                          placeholder="Longitude"
                          {...register(`location.${i}.lng` as const)}
                          className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.location?.[i]?.lng && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.location[i]?.lng?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => locArray.remove(i)}
                        disabled={locArray.fields.length === 1}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${locArray.fields.length === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                      >
                        Remove Location
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* Included */}
            {/* Included Section */}
            <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 mb-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Included Items</h3>
                <button
                  type="button"
                  onClick={() => setValue('included', [...(watch('included') ?? []), ''])}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  + Add Included
                </button>
              </div>

              {watch('included')?.map((_, i) => (
                <div key={i} className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-lg hover:shadow-md transition">
                    <input
                      {...register(`included.${i}` as const)}
                      placeholder={`Included item ${i + 1}`}
                      className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          'included',
                          watch('included').filter((_, idx) => idx !== i)
                        )
                      }
                      disabled={watch('included')?.length === 1}
                      className={`px-2 py-1 rounded-lg text-sm transition ${watch('included')?.length === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                    >
                      ❌
                    </button>
                  </div>

                  {/* ✅ Show individual error here */}
                  {errors.included?.[i]?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.included[i]?.message as string}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Not Included Section */}
            <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Not Included Items</h3>
                <button
                  type="button"
                  onClick={() => setValue('notIncluded', [...(watch('notIncluded') ?? []), ''])}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  + Add Not Included
                </button>
              </div>

              {watch('notIncluded')?.map((_, i) => (
                <div key={i} className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-lg hover:shadow-md transition">
                    <input
                      {...register(`notIncluded.${i}` as const)}
                      placeholder={`Not included item ${i + 1}`}
                      className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          'notIncluded',
                          watch('notIncluded').filter((_, idx) => idx !== i)
                        )
                      }
                      disabled={watch('notIncluded')?.length === 1}
                      className={`px-2 py-1 rounded-lg text-sm transition ${watch('notIncluded')?.length === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                    >
                      ❌
                    </button>
                  </div>

                  {/* ✅ Show error for each field */}
                  {errors.notIncluded?.[i]?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.notIncluded[i]?.message as string}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Itinerary Section */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Itinerary</h2>
                <button
                  type="button"
                  onClick={addDay}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  + Add Day
                </button>
              </div>

              {errors.itinerary?.root?.message && (
                <p className="text-red-500 text-sm mb-3">{errors.itinerary.root.message}</p>
              )}

              {itineraryArray.fields.map((day, i) => (
                <div
                  key={day.id}
                  className="border border-gray-300 bg-white rounded-lg p-5 mb-5 shadow-sm transition hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-700">Day {i + 1}</h3>
                    <button
                      type="button"
                      onClick={() => itineraryArray.remove(i)}
                      disabled={itineraryArray.fields.length === 1}
                      className={`text-sm font-medium px-2 py-1 rounded-lg transition ${itineraryArray.fields.length === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                    >
                      Delete Day
                    </button>
                  </div>

                  {/* Day Title */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day Title</label>
                    <input
                      {...register(`itinerary.${i}.title`)}
                      placeholder="Enter day title"
                      className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.itinerary?.[i]?.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.itinerary[i]?.title?.message}
                      </p>
                    )}
                  </div>

                  {/* Day Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register(`itinerary.${i}.description`)}
                      placeholder="Enter day description"
                      className="border border-gray-300 rounded-lg p-2.5 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.itinerary?.[i]?.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.itinerary[i]?.description?.message}
                      </p>
                    )}
                  </div>

                  {/* Activities */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Activities</h4>
                    <Controller
                      control={control}
                      name={`itinerary.${i}.activities`}
                      render={({ field }) => (
                        <div className="space-y-3">
                          {(field.value || []).map((act: any, j: number) => (
                            <div
                              key={j}
                              className="flex flex-col md:flex-row md:items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg"
                            >
                              {/* Start Time */}
                              <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-600 mb-1">
                                  Start
                                </label>
                                <input
                                  type="time"
                                  value={act.startTime}
                                  onChange={(e) => {
                                    const updated = [...field.value];
                                    updated[j].startTime = e.target.value;
                                    field.onChange(updated);
                                  }}
                                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                                />
                                {errors.itinerary?.[i]?.activities?.[j]?.startTime && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.itinerary[i]?.activities?.[j]?.startTime?.message}
                                  </p>
                                )}
                              </div>

                              <span className="text-gray-500 hidden md:block">to</span>

                              {/* End Time */}
                              <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-600 mb-1">
                                  End
                                </label>
                                <input
                                  type="time"
                                  value={act.endTime}
                                  onChange={(e) => {
                                    const updated = [...field.value];
                                    updated[j].endTime = e.target.value;
                                    field.onChange(updated);
                                  }}
                                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                                />
                                {errors.itinerary?.[i]?.activities?.[j]?.endTime && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.itinerary[i]?.activities?.[j]?.endTime?.message}
                                  </p>
                                )}
                              </div>

                              {/* Activity Text */}
                              <div className="flex flex-col flex-1">
                                <label className="text-xs font-medium text-gray-600 mb-1">
                                  Activity
                                </label>
                                <input
                                  placeholder="Enter activity"
                                  value={act.activity}
                                  onChange={(e) => {
                                    const updated = [...field.value];
                                    updated[j].activity = e.target.value;
                                    field.onChange(updated);
                                  }}
                                  className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                />
                                {errors.itinerary?.[i]?.activities?.[j]?.activity && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.itinerary[i]?.activities?.[j]?.activity?.message}
                                  </p>
                                )}
                              </div>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter((_: any, idx: number) => idx !== j)
                                  )
                                }
                                disabled={field.value.length === 1}
                                className={`mt-1 md:mt-6 px-2 py-1 rounded-lg text-sm transition ${field.value.length === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                  }`}
                              >
                                ❌
                              </button>
                            </div>
                          ))}

                          {/* Add Activity Button */}
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange([
                                ...(field.value ?? []),
                                { startTime: '', endTime: '', activity: '' },
                              ])
                            }
                            className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          >
                            + Add Activity
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>


            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Offer Details (optional)</h3>

              {!showOffer ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowOffer(true)}
                  className="text-sm"
                >
                  + Add Offer
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setShowOffer(false);
                    resetField('offer'); // clears values
                  }}
                  className="text-sm"
                >
                  − Remove Offer
                </Button>
              )}
            </div>

            {/* Offer Form */}
            {showOffer && (
              <div className="border border-gray-200 p-5 rounded-xl bg-gray-50 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Offer Name */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Offer Name</label>
                    <input
                      type="text"
                      placeholder="Enter offer name"
                      {...register('offer.name')}
                      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 p-2 rounded-md outline-none transition-all"
                    />
                    {errors.offer?.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.offer.name.message}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      {...register('offer.type')}
                      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 p-2 rounded-md outline-none transition-all"
                    >
                      <option value="">Select type</option>
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat</option>
                    </select>

                  </div>

                  {/* Value */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="number"
                      placeholder="Enter value"
                      {...register('offer.value', { valueAsNumber: true })}
                      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 p-2 rounded-md outline-none transition-all"
                    />
                    {errors.offer?.value && (
                      <p className="text-red-500 text-xs mt-1">{errors.offer.value.message}</p>
                    )}
                  </div>

                  {/* Valid Until */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                    <input
                      type="date"
                      {...register('offer.validUntil')}
                      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 p-2 rounded-md outline-none transition-all"
                    />
                    {errors.offer?.validUntil && (
                      <p className="text-red-500 text-xs mt-1">{errors.offer.validUntil.message}</p>
                    )}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('offer.isActive')}
                    id="offerActive"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="offerActive" className="text-sm text-gray-700 font-medium select-none">
                    Active Offer
                  </label>
                </div>

                {/* Generic Offer Error */}
                {errors.offer?.message && (
                  <p className="text-red-500 text-sm mt-3">{errors.offer.message}</p>
                )}
              </div>
            )}


            <div>
              <Label>Upload Images (Max 4)</Label>
              <br />
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <Button type="button" onClick={() => fileInputRef.current?.click()}>
                Upload Images
              </Button>

              {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}

              <div className="grid grid-cols-4 gap-2 mt-2">
                {croppedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Save Package'}
            </Button>
          </form>
        )}
        {/* </div> */}
      </div>
    </>
  );
}
