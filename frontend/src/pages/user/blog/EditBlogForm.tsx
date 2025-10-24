import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type EditBlogFormSchema, editBlogSchema } from '@/schemas/editBlogSchema';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/textarea';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';
import ImageCropper from '@/components/ImageCropper';
import { handleBlogEdit, fetchBlogById } from '@/services/user/blogService';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImagePlus } from 'lucide-react';

type ExistingImage = {
  url: string;
  public_id: string;
  _id: string;
};

const MAX_IMAGES = 4;

const EditBlogForm = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

  const {
    croppedImages,
    setCroppedImages,
    currentImage,
    fileInputRef,
    handleImageChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
  } = useImageUpload({ maxImages: MAX_IMAGES, maxSizeMB: 2 });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditBlogFormSchema>({
    resolver: zodResolver(editBlogSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
      tags: [],
    },
  });

  // Load existing blog data
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await fetchBlogById(blogId!);
        setValue('title', res.title);
        setValue('content', res.content);
        setValue('status', res.status);
        setValue('tags', res.tags || []);
        setExistingImages(res.images || []);
      } catch {
        toast.error('Failed to load blog');
      }
    };
    if (blogId) loadBlog();
  }, [blogId, setValue]);

  // Sync cropped images to form
  useEffect(() => {
    setValue('images', croppedImages, { shouldValidate: true });
  }, [croppedImages, setValue]);

  // Limit total images (existing + new)
  const onImageChangeWithLimit = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const remaining = MAX_IMAGES - (existingImages.length + croppedImages.length);
      if (remaining <= 0) {
        toast.error(`You can upload a maximum of ${MAX_IMAGES} images in total.`);
        return;
      }

      const arr = Array.from(files).slice(0, remaining);
      const dt = new DataTransfer();
      arr.forEach((f) => dt.items.add(f));

      const syntheticEvent = {
        ...e,
        target: { ...e.target, files: dt.files },
      } as React.ChangeEvent<HTMLInputElement>;

      handleImageChange(syntheticEvent);
    },
    [existingImages.length, croppedImages.length, handleImageChange]
  );

  const onSubmit = async (data: EditBlogFormSchema) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title.trim());
      formData.append('content', data.content.trim());
      formData.append('status', data.status!);
      formData.append('tags', data.tags?.join(',') || '');

      croppedImages.forEach((file) => {
        if (file instanceof File) formData.append('images', file);
      });

      existingImages.forEach((img, index) => {
        formData.append(`existingImages[${index}][url]`, img.url);
        formData.append(`existingImages[${index}][public_id]`, img.public_id);
        formData.append(`existingImages[${index}][_id]`, img._id);
      });

      await handleBlogEdit(blogId!, formData);
      toast.success('Blog updated successfully!');
      navigate('/account/my-blogs');
      reset();
      setCroppedImages([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update blog');
    }
  };

  const handleDeleteExistingImage = (public_id: string) => {
    setExistingImages((prev) => prev.filter((img) => img.public_id !== public_id));
  };

  return (
    <>
      {/* Crop Modal */}
      {currentImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Crop Image</h2>
            <ImageCropper
              image={currentImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          </div>
        </div>
      )}

      {/* Main Form */}
      {!currentImage && (
        <section className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              📝 Edit Blog
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <div>
                <Label>Title</Label>
                <Input
                  {...register('title')}
                  placeholder="Enter blog title"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <Label>Content</Label>
                <Textarea
                  {...register('content')}
                  rows={6}
                  placeholder="Update your blog content..."
                  className="mt-1"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <Label>Tags (comma separated)</Label>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <Input
                      placeholder="e.g. travel, nature"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(',').map((tag) => tag.trim())
                        )
                      }
                      value={field.value?.join(', ') || ''}
                      className="mt-1"
                    />
                  )}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <select
                  {...register('status')}
                  className="p-2 border rounded-lg w-full mt-1 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <Label>Upload Images (Total Max {MAX_IMAGES})</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={onImageChangeWithLimit}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white"
                  >
                    <ImagePlus size={18} />
                    Upload Images
                  </Button>
                </div>

                {/* Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {/* Existing images */}
                  {existingImages.map((img) => (
                    <div key={img.public_id} className="relative group">
                      <img
                        src={img.url}
                        alt="existing"
                        className="w-full h-28 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.public_id)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* New images */}
                  {croppedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="new"
                        className="w-full h-28 object-cover rounded-lg border"
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

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition"
                >
                  {isSubmitting ? 'Updating...' : 'Update Blog'}
                </Button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default EditBlogForm;
