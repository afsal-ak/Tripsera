import {  useEffect,  useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { addPackageSchema, type AddPackageFormSchema } from "@/schemas/AddPackageSchema";
import { addPackage } from "@/services/admin/packageService";
import { getCategory } from "@/services/admin/packageService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ImageCropper from '@/components/ImageCropper';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/button";

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
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddPackageFormSchema>({
    resolver: zodResolver(addPackageSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      durationDays: 1,
      durationNights: 0,
      startDate: "",
      endDate: "",
      category: [],
      startPoint: "",
      location: [
        {
          name: "",
          lat: "",
          lng: "",
        },
      ],

      included: [""],

      notIncluded: [""],
      itinerary: [
        {
          day: 1,
          title: "",
          description: "",
          activities: [{ startTime: "", endTime: "", activity: "" }],
        },
      ],
      images: [],
      offer: { type: "percentage", value: 0, validUntil: "", isActive: false },
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

  const navigate = useNavigate()
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
    return () => { mounted = false; };
  }, []);


  // Field arrays for location, included, notIncluded, itinerary
  const locArray = useFieldArray({ control, name: "location" as const });
  const itineraryArray = useFieldArray({ control, name: "itinerary" as const });

  // images & crop state
  const images = watch("images");
 
 
  // Submit
  const onSubmit = async (data: AddPackageFormSchema) => {
    try {
      setIsSubmittingPkg(true);

      const form = new FormData();

      croppedImages.forEach((file) => form.append('images', file))

      Object.entries(data).forEach(([key, value]) => {
        if (key === "images") return;  

        if (Array.isArray(value) || typeof value === "object") {
          // stringify arrays and objects
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, String(value ?? ""));
        }
      });

      // send
      await addPackage(form);
       navigate("/admin/packages");
      toast.success("Package saved successfullly");
      reset();
      setCroppedImages([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setIsSubmittingPkg(false);
    }
  };

  const addDay = () => {
    itineraryArray.append({
      day: itineraryArray.fields.length + 1,
      title: "",
      description: "",
      activities: [{ startTime: "", endTime: "", activity: "" }],
    });
  };
  useEffect(() => {
    console.log("Form errors:", errors);
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
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Add Package</h2>
        {!currentImage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-medium">Title</label>
              <input {...register("title")} className="border p-2 w-full rounded" />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <textarea {...register("description")} className="border p-2 w-full rounded" />
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
                    value={categoryOptions.filter(c => field.value?.includes(c.value))}
                    onChange={(selected) =>
                      field.onChange((selected as any).map((s: any) => s.value))
                    }
                    isClearable
                  />
                )}
              />
              {errors.category && (
                <p className="text-red-500">{errors.category.message}</p>
              )}
            </div>

            {/* Price & duration */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block">Price</label>
                <input type="number" {...register("price", { valueAsNumber: true })} className="border p-2 rounded w-full" />
                {errors.price && <p className="text-red-500">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block">Days</label>
                <input type="number" {...register("durationDays", { valueAsNumber: true })} className="border p-2 rounded w-full" />
                {errors.durationDays && <p className="text-red-500">{errors.durationDays.message}</p>}
              </div>
              <div>
                <label className="block">Nights</label>
                <input type="number" {...register("durationNights", { valueAsNumber: true })} className="border p-2 rounded w-full" />
                {errors.durationNights && <p className="text-red-500">{errors.durationNights.message}</p>}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Start Date</label>
                <input type="date" {...register("startDate")} className="border p-2 rounded w-full" />
                {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
              </div>
              <div>
                <label>End Date</label>
                <input type="date" {...register("endDate")} className="border p-2 rounded w-full" />
                {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            {/* Start point */}
            <div>
              <label>Start Point</label>
              <input {...register("startPoint")} className="border p-2 w-full rounded" />
              {errors.startPoint && <p className="text-red-500">{errors.startPoint.message}</p>}
            </div>


            {/* Locations */}
            <div>
              <label className="block font-medium mb-1">Locations</label>
              {locArray.fields.map((f, i) => (
                <div key={f.id} className="border p-4 rounded mb-4">
                  <div className="flex flex-col gap-2">

                    {/* Name Field */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">Name</label>
                      <input
                        placeholder="Location Name"
                        {...register(`location.${i}.name` as const)}
                        className="border p-2 rounded"
                      />
                      {errors.location?.[i]?.name && (
                        <p className="text-red-500 text-sm">{errors.location[i]?.name?.message}</p>
                      )}
                    </div>

                    {/* Latitude Field */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">Latitude</label>
                      <input
                        placeholder="Lat"
                        {...register(`location.${i}.lat` as const)}
                        className="border p-2 rounded"
                      />
                      {errors.location?.[i]?.lat && (
                        <p className="text-red-500 text-sm">{errors.location[i]?.lat?.message}</p>
                      )}
                    </div>

                    {/* Longitude Field */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">Longitude</label>
                      <input
                        placeholder="Lng"
                        {...register(`location.${i}.lng` as const)}
                        className="border p-2 rounded"
                      />
                      {errors.location?.[i]?.lng && (
                        <p className="text-red-500 text-sm">{errors.location[i]?.lng?.message}</p>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => locArray.remove(i)}
                      disabled={locArray.fields.length === 1}
                      className={`mt-2 text-red-600 ${locArray.fields.length === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => locArray.append({ name: "", lat: "", lng: "" })}
                className="text-blue-600 mt-2"
              >
                + Add Location
              </button>
            </div>



            {/* Included */}
            <div>
              <label className="block font-medium">Included</label>
              {watch("included")?.map((_, i) => (
                <div key={i} className="flex flex-col gap-1 mb-2">
                  <div className="flex gap-2">
                    <input
                      {...register(`included.${i}` as const)}
                      className="border p-2 w-full rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "included",
                          watch("included").filter((_, idx) => idx !== i)
                        )
                      }
                      disabled={watch("included")?.length === 1} // always keep at least 1
                      className={`${watch("included")?.length === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "text-red-600"
                        }`}
                    >
                      ❌
                    </button>
                  </div>
                  {errors.included?.[i] && (
                    <p className="text-red-500 text-sm">{errors.included[i]?.message}</p>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setValue("included", [...(watch("included") ?? []), ""])
                }
                className="text-blue-600 mt-1"
              >
                + Add Included
              </button>
            </div>

            {/* Not Included */}
            <div className="mt-4">
              <label className="block font-medium">Not Included</label>
              {watch("notIncluded")?.map((_, i) => (
                <div key={i} className="flex flex-col gap-1 mb-2">
                  <div className="flex gap-2">
                    <input
                      {...register(`notIncluded.${i}` as const)}
                      className="border p-2 w-full rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "notIncluded",
                          watch("notIncluded").filter((_, idx) => idx !== i)
                        )
                      }
                      disabled={watch("notIncluded")?.length === 1} // always keep at least 1
                      className={`${watch("notIncluded")?.length === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "text-red-600"
                        }`}
                    >
                      ❌
                    </button>
                  </div>
                  {errors.notIncluded?.[i] && (
                    <p className="text-red-500 text-sm">{errors.notIncluded[i]?.message}</p>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setValue("notIncluded", [...(watch("notIncluded") ?? []), ""])
                }
                className="text-blue-600 mt-1"
              >
                + Add Not Included
              </button>
            </div>


            {/* Itinerary */}

            <div>
              <label className="block font-medium">Itinerary</label>
              {errors.itinerary?.root?.message && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.itinerary.root.message}
                </p>
              )}


              {itineraryArray.fields.map((day, i) => (
                <div key={day.id} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Day {i + 1}</h3>
                    <button
                      type="button"
                      onClick={() => itineraryArray.remove(i)}
                      disabled={itineraryArray.fields.length === 1}
                      className={`${itineraryArray.fields.length === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "text-red-600"
                        }`}
                    >
                      Delete Day
                    </button>
                  </div>

                  {/* Day Title */}
                  <input
                    {...register(`itinerary.${i}.title`)}
                    placeholder="Day title"
                    className="border p-2 w-full mb-2"
                  />
                  {errors.itinerary?.[i]?.title && (
                    <p className="text-red-500 text-sm">{errors.itinerary[i]?.title?.message}</p>
                  )}

                  {/* Day Description */}
                  <textarea
                    {...register(`itinerary.${i}.description`)}
                    placeholder="Day description"
                    className="border p-2 w-full mb-2"
                  />
                  {errors.itinerary?.[i]?.description && (
                    <p className="text-red-500 text-sm">{errors.itinerary[i]?.description?.message}</p>
                  )}

                  {/* Activities */}
                  <Controller
                    control={control}
                    name={`itinerary.${i}.activities`}
                    render={({ field }) => (
                      <div className="space-y-2">
                        {(field.value || []).map((act: any, j: number) => (
                          <div key={j} className="flex gap-2 items-center">
                            <div className="flex flex-col">
                              <input
                                type="time"
                                value={act.startTime}
                                onChange={(e) => {
                                  const updated = [...field.value];
                                  updated[j].startTime = e.target.value;
                                  field.onChange(updated);
                                }}
                                className="border p-2 w-28"
                              />
                              {errors.itinerary?.[i]?.activities?.[j]?.startTime && (
                                <p className="text-red-500 text-sm">
                                  {errors.itinerary[i]?.activities?.[j]?.startTime?.message}
                                </p>
                              )}
                            </div>

                            <span>to</span>

                            <div className="flex flex-col">
                              <input
                                type="time"
                                value={act.endTime}
                                onChange={(e) => {
                                  const updated = [...field.value];
                                  updated[j].endTime = e.target.value;
                                  field.onChange(updated);
                                }}
                                className="border p-2 w-28"
                              />
                              {errors.itinerary?.[i]?.activities?.[j]?.endTime && (
                                <p className="text-red-500 text-sm">
                                  {errors.itinerary[i]?.activities?.[j]?.endTime?.message}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col flex-1">
                              <input
                                placeholder="Activity"
                                value={act.activity}
                                onChange={(e) => {
                                  const updated = [...field.value];
                                  updated[j].activity = e.target.value;
                                  field.onChange(updated);
                                }}
                                className="border p-2 flex-1"
                              />
                              {errors.itinerary?.[i]?.activities?.[j]?.activity && (
                                <p className="text-red-500 text-sm">
                                  {errors.itinerary[i]?.activities?.[j]?.activity?.message}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(field.value.filter((_: any, idx: number) => idx !== j))
                              }
                              className="text-red-600"
                              disabled={field.value.length === 1} // keep at least 1 activity
                            >
                              ❌
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            field.onChange([
                              ...(field.value ?? []),
                              { startTime: "", endTime: "", activity: "" },
                            ])
                          }
                          className="text-blue-600"
                        >
                          + Add Activity
                        </button>
                      </div>
                    )}
                  />
                </div>
              ))}

              <div>
                <button type="button" onClick={addDay} className="text-blue-600">
                  + Add Day
                </button>
              </div>
            </div>

            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="font-semibold mb-2">Offer Details</h3>

              {/* Offer Name */}
              <div className="flex flex-col mb-2">
                <label className="text-sm font-medium mb-1">Offer Name</label>
                <input
                  type="text"
                  placeholder="Offer name"
                  {...register("offer.name" as const)}
                  className="border p-2 rounded w-full"
                />
                {errors.offer?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.offer.name.message}</p>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:gap-3 items-start">
                {/* Offer Type */}
                <div className="flex flex-col mb-2 md:mb-0">
                  <label className="text-sm font-medium mb-1">Type</label>
                  <select
                    {...register("offer.type" as const)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                  {errors.offer?.value?.message && (
                    <p className="text-red-500 text-sm mt-1">{(errors.offer.value as any).message}</p>
                  )}

                </div>

                {/* Offer Value */}
                <div className="flex flex-col mb-2 md:mb-0">
                  <label className="text-sm font-medium mb-1">Value</label>
                  <input
                    type="number"
                    placeholder="Value"
                    {...register("offer.value" as const, { valueAsNumber: true })}
                    className="border p-2 rounded w-full md:w-32"
                  />
                  {errors.offer?.value && (
                    <p className="text-red-500 text-sm mt-1">{errors.offer.value.message}</p>
                  )}
                </div>

                {/* Valid Until */}
                <div className="flex flex-col mb-2 md:mb-0">
                  <label className="text-sm font-medium mb-1">Valid Until</label>
                  <input
                    type="date"
                    {...register("offer.validUntil" as const)}
                    className="border p-2 rounded w-full"
                  />
                  {errors.offer?.validUntil && (
                    <p className="text-red-500 text-sm mt-1">{errors.offer.validUntil.message}</p>
                  )}
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center mt-5 md:mt-0">
                  <input
                    type="checkbox"
                    {...register("offer.isActive" as const)}
                    id="offerActive"
                    className="mr-2"
                  />
                  <label htmlFor="offerActive" className="text-sm font-medium">Active</label>
                </div>
              </div>
            </div>
            <div>
              <Label>Upload Images (Max 4)</Label><br />
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
      </div>
    </>
  );
}
