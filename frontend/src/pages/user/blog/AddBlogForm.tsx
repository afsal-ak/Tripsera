import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, type BlogFormSchema } from '@/schemas/BlogSchema';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/textarea';
import { Label } from '@/components/Label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import ImageCropper from '@/components/ImageCropper';
import { handleBlogCreation } from '@/services/user/blogService';
import { useImageUpload } from '@/hooks/useImageUpload';

const AddBlogForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cover image upload (1 only)
  const coverUpload = useImageUpload({ maxImages: 1, maxSizeMB: 3 });

  // Section images state (cropped)
  const [sectionImages, setSectionImages] = useState<(File | null)[]>([]);
  const [sectionCropIndex, setSectionCropIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormSchema>({
    resolver: zodResolver(blogSchema),
    defaultValues: {

      sections: [],

      tags: [],
      status: 'published',
      coverImage: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'sections' });
  // keep RHF images in sync with hook state

  // sync cropped cover image
  useEffect(() => {
    setValue('coverImage', coverUpload.croppedImages, { shouldValidate: true });
  }, [coverUpload.croppedImages, setValue]);
  useEffect(() => {
    console.log('Sections updated:', watch('sections'));
  }, [watch('sections')]);

  const onSubmit = async (data: BlogFormSchema) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('overview', data.overview);
      formData.append('content', data.content);
      formData.append('status', data.status);

      // cover image
      if (coverUpload.croppedImages[0]) {
        formData.append('coverImage', coverUpload.croppedImages[0]);
      }

      // tags
      data.tags?.forEach((tag) => formData.append('tags', tag));


      data.sections?.forEach((section, index) => {
        formData.append(`sections[${index}][heading]`, section.heading);
        formData.append(`sections[${index}][content]`, section.content);

        const image = sectionImages[index];
        if (image) formData.append('sectionImages', image); //  use sectionImages (not sections[0][image])
      });

      await handleBlogCreation(formData);
      toast.success('Blog created successfully!');
      navigate('/account/my-blogs');
      reset();
      coverUpload.setCroppedImages([]);
      setSectionImages([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);

  return (
    <>
      {/* Cover crop modal */}
      {coverUpload.currentImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Crop Cover Image</h2>
            <ImageCropper
              image={coverUpload.currentImage}
              onCropComplete={coverUpload.handleCropComplete}
              onCancel={coverUpload.handleCropCancel}
              aspect={16 / 9}

            />
          </div>
        </div>
      )}

      {/* Section crop modal */}
      {sectionCropIndex !== null && sectionImages[sectionCropIndex] === null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Crop Section {sectionCropIndex + 1} Image
            </h2>
            <ImageCropper
              image={
                (fields[sectionCropIndex] as any)?.rawImage
                  ? URL.createObjectURL((fields[sectionCropIndex] as any)?.rawImage)
                  : ''
              }
              onCropComplete={(croppedFile) => {
                const newImages = [...sectionImages];
                newImages[sectionCropIndex] = croppedFile;
                setSectionImages(newImages);
                setSectionCropIndex(null);
                setValue(`sections.${sectionCropIndex}.image`, [croppedFile], { shouldValidate: true });

              }}
              onCancel={() => setSectionCropIndex(null)}
              
            />
          </div>
        </div>
      )}

      {/* Main Form */}
      {!coverUpload.currentImage && (
        <section className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl border border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              ✍️ Create Travel Blog
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <Label>Title</Label>
                <Input {...register('title')} placeholder="Enter blog title" />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              {/* Overview */}
              <div>
                <Label>Overview</Label>
                <Textarea {...register('overview')} rows={3} placeholder="Short intro..." />
                {errors.overview && (
                  <p className="text-red-500 text-sm">{errors.overview.message}</p>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <Label>Cover Image</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={coverUpload.fileInputRef}
                    onChange={coverUpload.handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => coverUpload.fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-black hover:bg-black text-white"
                  >
                    <ImagePlus size={18} /> Upload Cover Image
                  </Button>
                </div>

                {errors.coverImage && (
                  <p className="text-red-500 text-sm mt-1">{errors.coverImage.message}</p>
                )}

                {coverUpload.croppedImages.length > 0 && (
                  <div className="mt-3 relative w-full h-full">
                    <img
                      src={URL.createObjectURL(coverUpload.croppedImages[0])}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => coverUpload.handleRemoveImage(0)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <Label>Content</Label>
                <Textarea {...register('content')} rows={6} placeholder="Main story..." />
                {errors.content && (
                  <p className="text-red-500 text-sm">{errors.content.message}</p>
                )}
              </div>

              {/* Sections */}
              <div>

                {fields.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-4 mb-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-700">Section {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          remove(index);
                          setSectionImages((prev) => prev.filter((_, i) => i !== index));
                        }}

                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Heading */}
                    <Input
                      {...register(`sections.${index}.heading`)}
                      placeholder="Section title"
                      className="mb-1"
                    />
                    {errors.sections?.[index]?.heading && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.sections[index]?.heading?.message}
                      </p>
                    )}

                    {/* Content */}
                    <Textarea
                      {...register(`sections.${index}.content`)}
                      rows={3}
                      placeholder="Section content..."
                      className="mb-1"
                    />
                    {errors.sections?.[index]?.content && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.sections[index]?.content?.message}
                      </p>
                    )}

                    {/* Image Upload */}
                    <input
                      type="file"
                      accept="image/*"
                      id={`section-image-${index}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        (section as any).rawImage = file;
                        setSectionCropIndex(index); // open crop modal
                      }}
                    />

                    <Button
                      type="button"
                      onClick={() => document.getElementById(`section-image-${index}`)?.click()}
                      className="flex items-center gap-2 bg-gray-700 text-white"
                    >
                      <ImagePlus size={16} /> Add Section Image
                    </Button>

                    {/* Show validation error for image */}
                    {errors.sections?.[index]?.image && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.sections[index]?.image?.message}
                      </p>
                    )}

                    {/* Show selected or cropped image */}
                    {sectionImages[index] && (
                      <div className="mt-3 relative w-full h-full">
                        <img
                          src={URL.createObjectURL(sectionImages[index]!)}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = [...sectionImages];
                            newImgs[index] = null;
                            setSectionImages(newImgs);
                            setValue(`sections.${index}.image`, [], { shouldValidate: true });
                          }}
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                  </div>
                ))}
                <div className="flex justify-between items-center mb-2">
                  <Label>Additional Sections</Label>
                  <Button
                    type="button"
                    onClick={() => {
                      append({ heading: '', content: '', image: undefined! });
                      setSectionImages((prev) => [...prev, null]);
                    }}
                    className="bg-black text-white flex items-center gap-2"
                  >
                    <ImagePlus size={16} /> Add Section
                  </Button>
                </div>

              </div>

              {/* Tags */}
              <div>
                <Label>Tags (comma separated)</Label>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <Input
                      placeholder="e.g. adventure, nature, travel"
                      onChange={(e) =>
                        field.onChange(e.target.value.split(',').map((t) => t.trim()))
                      }
                      value={field.value?.join(', ') || ''}
                    />
                  )}
                />
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <select
                  {...register('status')}
                  className="p-2 border rounded-lg w-full mt-1 focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-black text-white font-medium rounded-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Publish Blog'}
                </Button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default AddBlogForm;
