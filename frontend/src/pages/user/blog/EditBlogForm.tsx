import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditBlogSchema, type EditBlogFormSchema } from '@/schemas/BlogSchema';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/textarea';
import { Label } from '@/components/Label';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import ImageCropper from '@/components/ImageCropper';
import { useImageUpload } from '@/hooks/useImageUpload';
import { fetchBlogById, handleBlogEdit } from '@/services/user/blogService';
import type { IBlog } from '@/types/IBlog';

interface ExistingImage {
  url: string;
  public_id: string;
}

const EditBlogForm = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [blogData, setBlogData] = useState<IBlog>()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletedSectionIds, setDeletedSectionIds] = useState<string[]>([]);

  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [existingCoverImage, setExistingCoverImage] = useState<ExistingImage | null>(null);
  const [existingSectionImages, setExistingSectionImages] = useState<(ExistingImage | null)[]>([]);

  const coverUpload = useImageUpload({ maxImages: 1, maxSizeMB: 3 });
  const [sectionImages, setSectionImages] = useState<(File | null)[]>([]);
  const [sectionCropIndex, setSectionCropIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditBlogFormSchema>({
    resolver: zodResolver(EditBlogSchema),
    defaultValues: {
      title: '',
      overview: '',
      content: '',
      tags: [],
      status: 'draft',
      sections: [],
      coverImage: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await fetchBlogById(blogId!);
        setBlogData(blog)
        setExistingCoverImage(blog.coverImage);
        setExistingSectionImages(blog.sections.map((s: any) => s.image || null));

        reset({
          title: blog.title,
          overview: blog.overview,
          content: blog.content,
          status: blog.status,
          tags: blog.tags || [],
          sections: blog.sections.map((s: any) => ({
            heading: s.heading,
            content: s.content,
            _id: s._id
          })),
        });
      } catch (err: any) {
        toast.error('Failed to load blog');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, reset]);

  // Sync cropped cover image
  useEffect(() => {
    setValue('coverImage', coverUpload.croppedImages);
  }, [coverUpload.croppedImages, setValue]);

  // Remove existing image
  const handleRemoveExistingImage = (public_id: string, type: 'cover' | 'section', index?: number) => {
    setDeletedImageIds((prev) => [...prev, public_id]);

    if (type === 'cover') setExistingCoverImage(null);
    if (type === 'section' && index !== undefined) {
      const updated = [...existingSectionImages];
      updated[index] = null;
      setExistingSectionImages(updated);
    }
  };

  const handleRemoveSection = (sectionId?: string, index?: number) => {
    if (sectionId) {
      setDeletedSectionIds((prev) => [...prev, sectionId]);
    }

    const updated = [...fields];
    updated.splice(index!, 1);
    setValue('sections', updated);
  };
  console.log(deletedSectionIds, 'section id deleted');


  console.log(existingSectionImages, 'existingSectionImages');

  const onSubmit = async (data: EditBlogFormSchema) => {
    try {
      setIsSubmitting(true);
      //   Validate cover image
      const hasExistingCover = !!existingCoverImage; // old image from DB
      const hasNewCover = !!coverUpload.croppedImages[0]; // new cropped image uploaded
      const isNewBlog = !blogId; // if blogId not defined → adding new blog

      if ((isNewBlog && !hasNewCover) || (!isNewBlog && !hasExistingCover && !hasNewCover)) {
        toast.error("Cover image is required.");
        setIsSubmitting(false);
        return;
      }

      // Validate each section before proceeding
      const missingImageSections = data.sections?.some((section, index) => {
        const isNewSection = !section._id; // no _id = newly added section
        const existingImage = existingSectionImages[index];
        const newImage = sectionImages[index];

        // New sections must have an uploaded image
        if (isNewSection && !newImage) return true;

        // Existing sections: if old image was removed, must upload a new one
        if (!isNewSection && !existingImage && !newImage) return true;

        return false;
      });

      if (missingImageSections) {
        toast.error("Each section must have an image before submitting.");
        setIsSubmitting(false);
        return;
      }

      //   Build form data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("overview", data.overview);
      formData.append("content", data.content);
      formData.append("status", data.status);

      //   Cover image
      if (coverUpload.croppedImages[0]) {
        formData.append("coverImage", coverUpload.croppedImages[0]);
      }

      //  Tags
      data.tags?.forEach((tag) => formData.append("tags", tag));

      //   Handle deleted images and sections
      deletedImageIds.forEach((id) => formData.append("deletedImages", id));
      deletedSectionIds.forEach((id) => formData.append("deletedSections", id));

      //   Loop through sections
      data.sections?.forEach((section, index) => {
        if (section._id) {
          formData.append(`sections[${index}][_id]`, section._id);
        }
        formData.append(`sections[${index}][heading]`, section.heading);
        formData.append(`sections[${index}][content]`, section.content);

        //  If a new image was uploaded, attach it
        if (sectionImages[index]) {
          formData.append("sectionImages", sectionImages[index]!);
          formData.append("sectionImageIndexes", index.toString());
        }
      });

      await handleBlogEdit(blogId!, formData);
      toast.success("Blog updated successfully");
      navigate("/account/my-blogs");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);
  if (loading) return <p className="text-center mt-10">Loading blog...</p>;


  return (
    <>
      {/* Cover Crop Modal */}
      {coverUpload.currentImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h2 className="font-semibold mb-4">Crop Cover Image</h2>
            <ImageCropper
              image={coverUpload.currentImage}
              aspect={16 / 9}
              onCropComplete={coverUpload.handleCropComplete}
              onCancel={coverUpload.handleCropCancel}
            />
          </div>
        </div>
      )}

      {/* Section Crop Modal */}
      {sectionCropIndex !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h2 className="font-semibold mb-4">Crop Section Image</h2>
            <ImageCropper
              image={
                (fields[sectionCropIndex] as any)?.rawImage
                  ? URL.createObjectURL((fields[sectionCropIndex] as any).rawImage)
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

      <section className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
        <h1 className="text-2xl font-semibold mb-6 text-center">✏️ Edit Blog</h1>

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
            <Textarea {...register('overview')} rows={3} />
              {errors.overview && (
                  <p className="text-red-500 text-sm">{errors.overview.message}</p>
                )}
          </div>

          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            {existingCoverImage ? (

              <div className="relative w-full h-full mt-3">
                <img
                  src={existingCoverImage.url}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setExistingCoverImage(null); // remove old one
                    coverUpload.setCroppedImages([]); // ensure no new image either
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            ) : coverUpload.croppedImages.length > 0 ? (
              <div className="relative w-full h-full mt-3">
                <img
                  src={URL.createObjectURL(coverUpload.croppedImages[0])}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => coverUpload.handleRemoveImage(0)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
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
                  className="bg-black text-white mt-2"
                >
                  <ImagePlus size={16} /> Upload New Cover
                </Button>
              </>
            )}
          </div>

          {/* Content */}
          <div>
            <Label>Content</Label>
            <Textarea {...register('content')} rows={5} />
          </div>

          {/* Sections */}
          <div>


            {fields.map((section, index) => {
              const sectionError = errors.sections?.[index];

              return (
                <div key={section.id} className="border p-4 rounded-lg mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Section {index + 1}</h3>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => {
                        if (existingSectionImages[index]?.public_id)
                          handleRemoveExistingImage(
                            existingSectionImages[index]!.public_id,
                            'section',
                            index
                          );

                        remove(index);
                        handleRemoveSection(section.id!);
                        setSectionImages((prev) => prev.filter((_, i) => i !== index));
                        setExistingSectionImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Heading */}
                  <Input
                    {...register(`sections.${index}.heading`)}
                    placeholder="Section title"
                    className="mb-2"
                  />
                  {sectionError?.heading && (
                    <p className="text-red-500 text-sm">{sectionError.heading.message}</p>
                  )}

                  {/* Content */}
                  <Textarea
                    {...register(`sections.${index}.content`)}
                    rows={3}
                    placeholder="Section content..."
                  />
                  {sectionError?.content && (
                    <p className="text-red-500 text-sm">{sectionError.content.message}</p>
                  )}

                  {/* Image */}
                  {existingSectionImages[index] ? (
                    <div className="relative w-full h-full mt-3">
                      <img
                        src={existingSectionImages[index]!.url}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveExistingImage(
                            existingSectionImages[index]!.public_id,
                            'section',
                            index
                          )
                          setValue(`sections.${index}.image`, [], { shouldValidate: true });

                        }}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  ) : sectionImages[index] ? (
                    <div className="relative w-full h-full mt-3">
                      <img
                        src={URL.createObjectURL(sectionImages[index]!)}
                        className="w-full h-full object-cover rounded-lg"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...sectionImages];
                          newImages[index] = null;
                          setSectionImages(newImages);

                          const existing = [...existingSectionImages];
                          existing[index] = null;
                          setExistingSectionImages(existing);

                          // Optional: trigger revalidation
                          setValue(`sections.${index}.image`, [], { shouldValidate: true });
                        }}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                      >
                        ✕
                      </button>

                      {!existingSectionImages[index] && !sectionImages[index] && (
                        <p className="text-red-500 text-sm mt-2">Image is required for this section</p>
                      )}

                    </div>
                  ) : (
                    <>
                      <Button
                        type="button"
                        className="bg-gray-700 text-white mt-2"
                        onClick={() =>
                          document.getElementById(`section-img-${index}`)?.click()
                        }
                      >
                        <ImagePlus size={16} /> Upload Section Image
                      </Button>
                      {/*  Show image required error if no image and no existing image */}
                      {sectionError?.image && !existingSectionImages[index] && (
                        <p className="text-red-500 text-sm mt-1">
                          {sectionError.image.message as string}
                        </p>
                      )}
                    </>
                  )}

                  <input
                    type="file"
                    id={`section-img-${index}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      (section as any).rawImage = file;
                      setSectionCropIndex(index);
                    }}
                  />
                </div>
              );
            })}
            <div className="flex justify-between items-center mb-2">
              <Label>Sections</Label>
              <Button
                type="button"
                className="bg-black text-white"
                onClick={() => {
                  append({ heading: '', content: '', image: undefined! });
                  setSectionImages((prev) => [...prev, null]);
                  setExistingSectionImages((prev) => [...prev, null]);
                }}
              >
                Add Section
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
                  placeholder="e.g. travel, adventure"
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
              className="border rounded-lg w-full p-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3"
            >
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditBlogForm;
